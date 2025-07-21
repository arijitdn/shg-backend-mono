import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  designation: string;

  @IsString()
  post: string;

  @IsOptional()
  @IsString()
  status?: string; // optional, defaults to 'active'

  @IsOptional()
  @IsDateString()
  joinDate?: Date;
}
