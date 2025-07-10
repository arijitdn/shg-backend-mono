import { Module } from '@nestjs/common';
import { ClfService } from './clf.service';
import { ClfController } from './clf.controller';

@Module({
  controllers: [ClfController],
  providers: [ClfService],
})
export class ClfModule {}
