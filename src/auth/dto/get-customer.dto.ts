import { IsUUID } from 'class-validator';

export class GetCustomerDto {
  @IsUUID()
  userId: string;
}
