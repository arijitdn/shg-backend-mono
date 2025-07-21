import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { SHGEntity } from './entities/shg.entity';
import { VOEntity } from './entities/vo.entity';
import { CLFEntity } from './entities/clf.entity';
import { TRLMAdminEntity } from './entities/trlm-admin.entity';
import { DbService } from './db.service';
import { NotificationEntity, ProductEntity } from './entities';
import { OrderEntity } from './entities/order.entity';
import { PostEntity } from './entities/posts.entity';
import { CustomerEntity } from './entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SHGEntity,
      VOEntity,
      CLFEntity,
      TRLMAdminEntity,
      ProductEntity,
      NotificationEntity,
      OrderEntity,
      PostEntity,
      CustomerEntity,
    ]),
  ],
  providers: [DbService],
  exports: [TypeOrmModule, DbService],
})
export class DbModule {}
