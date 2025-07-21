import { IsPhoneNumber, MinLength } from 'class-validator';

export class LoginDto {
  @IsPhoneNumber()
  phone: string;

  @MinLength(6)
  password: string;
}
