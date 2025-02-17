import { UserRole } from '../constants/db.constants';

export class CreateUserDto {
  name: string;
  email: string;
  role: UserRole;
  password: string;
}
