import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);
    if (user) {
      const passwordMatching = bcrypt.compareSync(pass, user?.password);
      console.log('passmatch', passwordMatching);
      if (!passwordMatching) {
        throw new BadRequestException('Invalid Password');
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
