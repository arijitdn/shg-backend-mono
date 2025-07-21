import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  ValidateIf,
  ValidateNested,
  IsBoolean,
  IsInt,
  isNotEmpty,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@app/db/enums/order-status';

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
  @IsString()
  customerId?: string;

  @ValidateIf((o) => !o.trlmId)
  @IsNotEmpty()
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
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsDateString()
  confirmedAt?: string;

  @IsOptional()
  @IsDateString()
  shippedAt?: string;

  @IsOptional()
  @IsDateString()
  deliveredAt?: string;

  @IsOptional()
  @IsDateString()
  cancelledAt?: string;

  @IsOptional()
  @IsInt()
  discount?: number; // discountValue: can be flat or percent based on discountType

  @ValidateIf((o) => o.discount !== undefined)
  @IsString()
  discountType?: 'flat' | 'percent'; // Required if discount is present

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsInt()
  couponDiscount?: number;

  // @IsOptional()
  // @IsBoolean()
  // isDispatched?: boolean;

  // @IsOptional()
  // @IsBoolean()
  // isDelivered?: boolean;

  // @IsOptional()
  // @IsBoolean()
  // isCancelled?: boolean;

  // @IsOptional()
  // @IsBoolean()
  // isReturn?: boolean;

  @IsOptional()
  @IsString()
  deliveryNotes?: string;

  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;
}
