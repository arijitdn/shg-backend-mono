import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { SHGEntity } from './entities/shg.entity';
import { VOEntity } from './entities/vo.entity';
import { CLFEntity } from './entities/clf.entity';
import { TRLMAdminEntity } from './entities/trlm-admin.entity';
import { DbService } from './db.service';
import { ProductEntity } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SHGEntity,
      VOEntity,
      CLFEntity,
      TRLMAdminEntity,
      ProductEntity,
    ]),
  ],
  providers: [DbService],
  exports: [TypeOrmModule, DbService],
})
export class DbModule {}
