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
import { ShgService } from './shg.service';
import { CreateShgDto } from './dto/create-shg.dto';
import { UpdateShgDto } from './dto/update-shg.dto';
import { JwtAuthGuard } from 'src/org-auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/org-auth/guards/roles-guard';
import { UserRole } from '@app/db/enums/user-role.enum';
import { Roles } from 'src/org-auth/decorators/roles.decorator';

@Controller('shg')
export class ShgController {
  constructor(private readonly shgService: ShgService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU)
  @Post()
  create(@Body() createShgDto: CreateShgDto) {
    return this.shgService.create(createShgDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU, UserRole.DMMU, UserRole.NIC)
  @Get()
  findAll() {
    return this.shgService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU, UserRole.DMMU, UserRole.NIC)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shgService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShgDto: UpdateShgDto) {
    return this.shgService.update(id, updateShgDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shgService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU, UserRole.DMMU, UserRole.NIC)
  @Get('members/:groupId')
  getMembers(@Param('groupId') groupId: string) {
    return this.shgService.getMembers(groupId);
  }
}
