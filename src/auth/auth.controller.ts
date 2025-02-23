import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/common/dto/auth.dto';
import { FirebaseAuthGuard } from 'src/common/guards/firebase-auth.guard';
import { CreatedBy } from 'src/common/decorators/createdby.decorator';
import { ApiResponse, ReqInfo } from 'src/common/types';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(FirebaseAuthGuard)
  @Post('register')
  async registerUser(
    @Body() user: SignUpDto,
    @CreatedBy() createdBy: ReqInfo,
  ): Promise<ApiResponse> {
    return await this.authService.createUser(user, createdBy);
  }
}
