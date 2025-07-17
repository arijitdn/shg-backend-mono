import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  ValidateIf,
  ValidateNested,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DeliveryAddressDto {
  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  pin: string;

  @IsString()
  district: string;

  @IsString()
  village: string;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  alternatePhoneNumber?: string;

  @IsString()
  addressType: string; // 'home' or 'work'

  @IsOptional()
  @IsString()
  landmark?: string;
}

export class CreateOrderDto {
  @IsOptional()
  orderId: string;

  @IsString()
  productId: string;
  @ValidateIf((o) => !o.customerId)
  @IsOptional()
  @IsString()
  trlmId?: string;

  @ValidateIf((o) => !o.trlmId)
  @IsOptional()
  @IsString()
  customerId?: string;

  @ValidateIf((o) => !o.customerId)
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsInt()
  quantity: number;

  @IsOptional()
  @IsDateString()
  orderDate?: string;

  @IsInt()
  @IsOptional()
  orderPrice: number;

  @IsInt()
  originalPrice: number;

  @IsOptional()
  @IsInt()
  discount?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  isDispatched?: boolean;

  @IsOptional()
  @IsBoolean()
  isDelivered?: boolean;

  @IsOptional()
  @IsBoolean()
  isCancelled?: boolean;

  @IsOptional()
  @IsBoolean()
  isReturn?: boolean;

  @IsOptional()
  @IsString()
  deliveryNotes?: string;

  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;
}
