import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClfDto {
  @IsString()
  @IsOptional()
  groupId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  district: string;
}
