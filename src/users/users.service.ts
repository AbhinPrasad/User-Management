import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/common/dto/user.dto';
import { ApiResponse, ReqInfo } from 'src/common/types';
import { User } from 'src/entities/user.entity';
import { msg } from 'src/common/constants/message.constants';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private users: Repository<User>) {}

  async createUser(
    userDto: CreateUserDto,
    createdBy: ReqInfo,
  ): Promise<ApiResponse> {
    const userExists = await this.users.findOne({
      where: { email: userDto.email },
    });
    if (userExists) {
      throw new ConflictException(msg.emailExists);
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const user = this.users.create({
      ...userDto,
      createdBy,
      password: hashedPassword,
    });
    const newUser = await this.users.save(user);

    return newUser.id
      ? { message: msg.createUserSuccess, userId: newUser.id }
      : { message: msg.createUserFailed };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.findOne({ where: { email } });
  }
}
