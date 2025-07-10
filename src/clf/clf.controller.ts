import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClfService } from './clf.service';
import { CreateClfDto } from './dto/create-clf.dto';
import { UpdateClfDto } from './dto/update-clf.dto';

@Controller('clf')
export class ClfController {
  constructor(private readonly clfService: ClfService) {}

  @Post()
  create(@Body() createClfDto: CreateClfDto) {
    return this.clfService.create(createClfDto);
  }

  @Get()
  findAll() {
    return this.clfService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clfService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClfDto: UpdateClfDto) {
    return this.clfService.update(+id, updateClfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clfService.remove(+id);
  }
}
