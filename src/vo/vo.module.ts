import { Module } from '@nestjs/common';
import { VoService } from './vo.service';
import { VoController } from './vo.controller';
import { DbModule } from '@app/common/db';

@Module({
  imports: [DbModule],
  controllers: [VoController],
  providers: [VoService],
})
export class VoModule {}
