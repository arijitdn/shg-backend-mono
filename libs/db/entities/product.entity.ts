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
import { ProductStatus } from '../enums/product-status.enum';

@Entity({ name: 'products' })
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

  @Column('int')
  @IsNumber()
  @IsPositive()
  price: number;

  @Column()
  @IsNumber()
  @IsPositive()
  stock: number;

  @Column()
  @IsUrl()
  imageUrl: string;

  @Column()
  @IsString()
  userId: string;

  @Column()
  @IsString()
  shgId: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.PENDING,
  })
  status: ProductStatus;

  // RECOMMENDATION FIELDS
  @Column({ default: false, nullable: true }) // Enforce Conditional Validation in DTO
  @IsBoolean()
  isRecommended: boolean;

  @Column({ nullable: true })
  recommendationDate: Date;

  // APPROVAL FIELDS
  @Column({ default: false })
  @IsBoolean()
  isApproved: boolean;

  @Column({ nullable: true })
  approvalDate: Date;

  // REJECTION FIELDS
  @Column({ default: false })
  @IsBoolean()
  isRejected: boolean;

  @Column({ nullable: true })
  rejectedBy: string;

  @Column({ nullable: true })
  rejectionDate: Date;

  @Column({ nullable: true })
  remarks: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
