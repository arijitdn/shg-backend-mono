import { productCategory } from '@app/common/db/enums/product-category.enum';
import { productType } from '@app/common/db/enums/product-type.enum';
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

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  stock: number;

  @IsUrl()
  imgUrl: string;

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
