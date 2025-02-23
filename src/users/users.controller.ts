import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/common/dto/user.dto';
import { CreatedBy } from 'src/common/decorators/createdby.decorator';
import { ApiResponse, ReqInfo } from 'src/common/types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/constants/db.constants';

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

  @Roles([UserRole.PLATFORM_ADMIN])
  @Get()
  async getUsersList(): ApiResponse {
    return await this.userService.getAllUsers();
  }
}
