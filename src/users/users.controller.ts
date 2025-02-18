import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/common/dto/user.dto';
import { CreatedBy } from 'src/common/decorators/createdby.decorator';
import { ApiResponse, ReqInfo } from 'src/common/types';
import { msg } from 'src/common/constants/message.constants';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async addUser(
    @Body() userDto: CreateUserDto,
    @CreatedBy() createdBy: ReqInfo,
  ): ApiResponse {
    const userExists = await this.userService.getUserByEmail(userDto.email);
    if (userExists) {
      throw new ConflictException(msg.emailExists);
    }
    const user = await this.userService.createUser(userDto, createdBy);
    return user.id
      ? { message: msg.createUserSuccess, userId: user.id }
      : { message: msg.createUserFailed };
  }
}
