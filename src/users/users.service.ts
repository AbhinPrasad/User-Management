import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/common/dto/user.dto';
import { ReqInfo } from 'src/common/types';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(
    userDto: CreateUserDto,
    createdBy: ReqInfo,
  ): Promise<{ id: string }> {
    const user = this.userRepo.create({ createdBy, ...userDto });
    const newUser = await this.userRepo.save(user);
    return { id: newUser.id ?? null };
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
}
