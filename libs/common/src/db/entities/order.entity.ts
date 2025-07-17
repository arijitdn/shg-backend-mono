import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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

  @Column('float')
  orderPrice: number;

  @Column('float')
  originalPrice: number;

  @Column('float', { nullable: true })
  discount?: number;

  @Column({ default: 'Created' })
  status?: string;

  @Column({ default: false })
  isDispatched: boolean;

  @Column({ default: false })
  isDelivered: boolean;

  @Column({ default: false })
  isCancelled: boolean;

  @Column({ default: false })
  isReturn: boolean;

  @Column({ nullable: true })
  deliveryNotes?: string;

  @Column((type) => DeliveryAddress)
  deliveryAddress: DeliveryAddress;
}
