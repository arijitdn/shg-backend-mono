import { Module } from '@nestjs/common';
import { ShgService } from './shg.service';
import { ShgController } from './shg.controller';
import { DbModule } from '@app/common/db';

@Module({
  imports: [DbModule],
  controllers: [ShgController],
  providers: [ShgService],
})
export class ShgModule {}
