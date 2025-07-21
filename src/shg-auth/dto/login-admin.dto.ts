import { IsEmail, IsPhoneNumber, MinLength } from 'class-validator';

export class AdminLoginDto {
  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
