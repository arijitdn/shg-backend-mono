import { Module } from '@nestjs/common';
import { ClfService } from './clf.service';
import { ClfController } from './clf.controller';
import { DbModule } from '@app/db';

@Module({
  imports: [DbModule],
  controllers: [ClfController],
  providers: [ClfService],
})
export class ClfModule {}
