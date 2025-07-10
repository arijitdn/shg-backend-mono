import { PartialType } from '@nestjs/swagger';
import { CreateClfDto } from './create-clf.dto';

export class UpdateClfDto extends PartialType(CreateClfDto) {}
