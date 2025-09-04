import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Amount in smallest currency unit (paisa for INR)',
    example: 50000,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'INR',
    default: 'INR',
  })
  @IsString()
  @IsOptional()
  currency?: string = 'INR';

  @ApiProperty({
    description: 'Receipt identifier',
    example: 'receipt_order_123',
  })
  @IsString()
  @IsOptional()
  receipt?: string;
}
