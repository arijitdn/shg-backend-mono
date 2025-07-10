import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVoDto {
  @IsString()
  @IsOptional()
  groupId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  clfId: string;
}
