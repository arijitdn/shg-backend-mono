import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  role: 'SHG' | 'VO' | 'BMMU' | 'DMMU' | 'NIC';
}
