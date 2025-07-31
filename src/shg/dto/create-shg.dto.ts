import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShgDto {
  @IsString()
  @IsOptional()
  groupId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  block: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  voId: string;

  @IsString()
  @IsNotEmpty()
  clfId: string;

  @IsString()
  type: string;
}
