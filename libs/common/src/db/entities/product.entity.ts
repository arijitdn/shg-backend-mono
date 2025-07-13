import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { productType } from '../enums/product-type.enum';
import { productCategory } from '../enums/product-category.enum';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ type: 'enum', enum: productType })
  type: productType;

  @Column({ type: 'enum', enum: productCategory })
  category: productCategory;

  @Column()
  @IsString()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  @IsPositive()
  price: number;

  @Column()
  @IsNumber()
  @IsPositive()
  stock: number;

  @Column()
  @IsUrl()
  imgUrl: string;

  @Column()
  @IsString()
  userId: string;

  @Column()
  @IsString()
  shgId: string;

  @Column({ default: false, nullable: true }) // Enforce Conditional Validation in DTO
  @IsBoolean()
  isRecommended: boolean;

  @Column({ default: false })
  @IsBoolean()
  isApproved: boolean;

  @Column({ nullable: true })
  verificationDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
