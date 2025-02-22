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

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private users: Repository<User>) {}

  async createUser(user: SignUpDto, createdBy: ReqInfo): Promise<ApiResponse> {
    await this.setCustomClaims(user.email, user.role);

    await this.checkUserExists(user.email);

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const userData = this.users.create({
      ...user,
      createdBy,
      password: hashedPassword,
    });
    const newUser = await this.users.save(userData);

    return newUser.id
      ? { message: msg.userRegistrationSuccess, userId: newUser.id }
      : { message: msg.userRegistrationFailed };
  }

  async setCustomClaims(email: string, role: string): Promise<void> {
    const userRecord = await admin.auth().getUserByEmail(email);
    if (!userRecord) {
      throw new BadRequestException(msg.userNotFound);
    }
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });
  }

  async checkUserExists(email: string): Promise<void> {
    const userExists = await this.users.findOne({
      where: { email },
    });
    if (userExists) {
      throw new ConflictException(msg.emailExists);
    }
  }
}
