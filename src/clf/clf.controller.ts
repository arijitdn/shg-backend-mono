import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClfService } from './clf.service';
import { CreateClfDto } from './dto/create-clf.dto';
import { UpdateClfDto } from './dto/update-clf.dto';
import { JwtAuthGuard } from 'src/org-auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/org-auth/guards/roles-guard';
import { UserRole } from '@app/db/enums/user-role.enum';
import { Roles } from 'src/org-auth/decorators/roles.decorator';

@Controller('clf')
export class ClfController {
  constructor(private readonly clfService: ClfService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU)
  @Post()
  create(@Body() createClfDto: CreateClfDto) {
    return this.clfService.create(createClfDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU, UserRole.DMMU, UserRole.NIC)
  @Get()
  findAll() {
    return this.clfService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU, UserRole.DMMU)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clfService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClfDto: UpdateClfDto) {
    return this.clfService.update(id, updateClfDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clfService.remove(id);
  }
}
