import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';

export enum TRLMLevel {
  DMMU = 'DMMU',
  BMMU = 'BMMU',
}

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  password: string;

  @IsString()
  designation: string;

  @IsString()
  postId: string;

  @IsEnum(TRLMLevel)
  level: TRLMLevel;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  joinDate?: string;
}
