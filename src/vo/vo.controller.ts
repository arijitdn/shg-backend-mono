import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VoService } from './vo.service';
import { CreateVoDto } from './dto/create-vo.dto';
import { UpdateVoDto } from './dto/update-vo.dto';

@Controller('vo')
export class VoController {
  constructor(private readonly voService: VoService) {}

  @Post()
  create(@Body() createVoDto: CreateVoDto) {
    return this.voService.create(createVoDto);
  }

  @Get()
  findAll() {
    return this.voService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoDto: UpdateVoDto) {
    return this.voService.update(id, updateVoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voService.remove(id);
  }
}
