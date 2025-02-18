import { UserRole } from '../constants/db.constants';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';
import { validationMsg } from '../constants/message.constants';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: validationMsg.invalidPassword,
  })
  password: string;
}
