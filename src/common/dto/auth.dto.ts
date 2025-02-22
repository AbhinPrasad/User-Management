import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../constants/db.constants';

export class SignUpDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firebaseId: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  password: string;
}
