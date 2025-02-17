import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async addUser(@Body() userDto: any): Promise<any> {
    return await this.userService.createUser(userDto);
  }
}
