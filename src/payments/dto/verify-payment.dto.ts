import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'Razorpay order ID',
    example: 'order_123456789',
  })
  @IsString()
  razorpay_order_id: string;

  @ApiProperty({
    description: 'Razorpay payment ID',
    example: 'pay_123456789',
  })
  @IsString()
  razorpay_payment_id: string;

  @ApiProperty({
    description: 'Razorpay signature',
    example: 'signature_hash_123',
  })
  @IsString()
  razorpay_signature: string;
}
