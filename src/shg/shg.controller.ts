import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShgService } from './shg.service';
import { CreateShgDto } from './dto/create-shg.dto';
import { UpdateShgDto } from './dto/update-shg.dto';

@Controller('shg')
export class ShgController {
  constructor(private readonly shgService: ShgService) {}

  @Post()
  create(@Body() createShgDto: CreateShgDto) {
    return this.shgService.create(createShgDto);
  }

  @Get()
  findAll() {
    return this.shgService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shgService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShgDto: UpdateShgDto) {
    return this.shgService.update(id, updateShgDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shgService.remove(id);
  }
}
