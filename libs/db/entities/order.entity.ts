import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../enums/order-status';

class DeliveryAddress {
  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  pin: string;

  @Column()
  district: string;

  @Column()
  village: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  alternatePhoneNumber?: string;

  @Column()
  addressType: string; // 'home' or 'work'

  @Column({ nullable: true })
  landmark?: string;
}

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @Column()
  productId: string;
  @Column({ nullable: true })
  trlmId?: string;

  @Column({ nullable: true })
  customerId?: string;

  @Column({ nullable: true })
  customerName?: string;

  @Column('int')
  quantity: number;

  @CreateDateColumn({ type: 'timestamptz' })
  orderDate: Date;

  @Column('int')
  orderPrice: number;

  @Column('int')
  originalPrice: number;

  @Column('float', { nullable: true })
  discount?: number;

  @Column({ nullable: true })
  discountType?: 'flat' | 'percent';

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  status: OrderStatus;

  @Column({ type: 'timestamptz', nullable: true })
  statusUpdatedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  shippedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deliveredAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  cancelledAt?: Date;

  // @Column({ default: false })
  // isDispatched: boolean;

  // @Column({ default: false })
  // isDelivered: boolean;

  // @Column({ default: false })
  // isCancelled: boolean;

  // @Column({ nullable: true })
  // couponCode?: string;

  // @Column({ nullable: true })
  // couponDiscount?: number;

  // @Column({ default: false })
  // isReturn: boolean;

  // @Column({ nullable: true })
  // deliveryNotes?: string;

  // @Column((type) => DeliveryAddress)
  // deliveryAddress: DeliveryAddress;
}
