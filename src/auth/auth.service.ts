import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from 'src/common/dto/auth.dto';
import { User } from 'src/entities/user.entity';
import { ApiResponse, ReqInfo } from 'src/common/types';
import { msg } from 'src/common/constants/message.constants';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private users: Repository<User>) {}

  private readonly SALT_ROUNDS = 10;

  async createUser(user: SignUpDto, createdBy: ReqInfo): Promise<ApiResponse> {
    await this.checkUserExists(user.email);

    const hashedPassword = await bcrypt.hash(user.password, this.SALT_ROUNDS);

    const newUser = await this.insertUserToDb(user, createdBy, hashedPassword);

    await this.setFirebaseCustomClaims(user.firebaseId, user.role, newUser.id);

    return { message: msg.userRegistrationSuccess, userId: newUser.id };
  }

  private async checkUserExists(email: string): Promise<void> {
    const userExists = await this.users.findOne({
      where: { email },
      select: ['id'],
    });

    if (userExists) {
      throw new ConflictException(msg.emailExists);
    }
  }

  private async insertUserToDb(
    user: SignUpDto,
    createdBy: ReqInfo,
    password: string,
  ): Promise<User> {
    const userData = this.users.create({
      ...user,
      createdBy,
      password,
    });
    const newUser = await this.users.save(userData);

    if (!newUser.id) {
      throw new BadRequestException(msg.createUserFailed);
    }

    return newUser;
  }

  private async setFirebaseCustomClaims(
    uid: string,
    role: string,
    userId: string,
  ): Promise<void> {
    await admin.auth().setCustomUserClaims(uid, {
      role,
      userId,
    });
  }
}
