import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DbModule } from 'libs/common/src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
