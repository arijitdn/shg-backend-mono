import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '@app/db/entities/notifications.entity';
import { InAppService } from './in-app.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  providers: [InAppService],
  exports: [InAppService],
})
export class InAppModule {}
