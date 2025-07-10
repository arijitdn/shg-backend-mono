import { PartialType } from '@nestjs/swagger';
import { CreateShgDto } from './create-shg.dto';

export class UpdateShgDto extends PartialType(CreateShgDto) {}
