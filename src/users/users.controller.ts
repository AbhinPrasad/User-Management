import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/common/dto/user.dto';
import { CreatedBy } from 'src/common/decorators/createdby.decorator';
import { ApiResponse, ReqInfo } from 'src/common/types';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async addUser(
    @Body() userDto: CreateUserDto,
    @CreatedBy() createdBy: ReqInfo,
  ): ApiResponse {
    return await this.userService.createUser(userDto, createdBy);
  }
}
