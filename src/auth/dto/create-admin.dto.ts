import { UserRole } from '@app/common/db/enums/user-role.enum';
import {
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  name: string;

  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
