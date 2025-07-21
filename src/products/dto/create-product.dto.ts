import { productCategory } from '@app/common/db/enums/product-category.enum';
import { productType } from '@app/common/db/enums/product-type.enum';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsPositive,
  IsUrl,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(productType)
  type: productType;

  @IsEnum(productCategory)
  category: productCategory;

  @IsNotEmpty()
  @IsString()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  stock: number;

  @IsString()
  userId: string;

  @IsString()
  shgId: string;

  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean;

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @IsOptional()
  verificationDate?: Date;
}
