import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CartItemEntity,
  CartEntity,
  CustomerEntity,
  ProductEntity,
} from '@app/db/entities';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartEntity,
      CartItemEntity,
      CustomerEntity,
      ProductEntity,
    ]),
    OrderModule,
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
