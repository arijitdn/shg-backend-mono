import { UserRole } from '@app/db/enums/user-role.enum';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class createMemberDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  phone: string;

  @IsEnum(UserRole)
  role?: UserRole;

  @IsString()
  organizationId?: string;

  @IsString()
  organizationType?: string;
}
