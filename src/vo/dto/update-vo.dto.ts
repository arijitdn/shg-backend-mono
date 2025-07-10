import { PartialType } from '@nestjs/swagger';
import { CreateVoDto } from './create-vo.dto';

export class UpdateVoDto extends PartialType(CreateVoDto) {}
