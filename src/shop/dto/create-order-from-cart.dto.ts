import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DeliveryAddressDto {
  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  pin: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  village: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ required: false })
  @IsString()
  alternatePhoneNumber?: string;

  @ApiProperty()
  @IsString()
  addressType: string; // 'home' or 'work'

  @ApiProperty({ required: false })
  @IsString()
  landmark?: string;
}

export class CreateOrderFromCartDto {
  @ApiProperty({ description: 'Customer ID' })
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @ApiProperty({ description: 'Customer name' })
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Delivery address' })
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;
}
