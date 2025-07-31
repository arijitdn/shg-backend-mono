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
import { VoService } from './vo.service';
import { CreateVoDto } from './dto/create-vo.dto';
import { UpdateVoDto } from './dto/update-vo.dto';
import { RolesGuard } from 'src/org-auth/guards/roles-guard';
import { JwtAuthGuard } from 'src/org-auth/guards/jwt-auth.guard';
import { UserRole } from '@app/db/enums/user-role.enum';
import { Roles } from 'src/org-auth/decorators/roles.decorator';

@Controller('vo')
export class VoController {
  constructor(private readonly voService: VoService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU)
  @Post()
  create(@Body() createVoDto: CreateVoDto) {
    return this.voService.create(createVoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU, UserRole.DMMU, UserRole.NIC)
  @Get()
  findAll() {
    return this.voService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU, UserRole.DMMU, UserRole.NIC)
  @Get(':groupId')
  findOne(@Param('groupId') groupId: string) {
    return this.voService.findOne(groupId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU)
  @Patch(':groupId')
  update(@Param('groupId') groupId: string, @Body() updateVoDto: UpdateVoDto) {
    return this.voService.update(groupId, updateVoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU)
  @Delete(':groupId')
  remove(@Param('groupId') groupId: string) {
    return this.voService.remove(groupId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BMMU, UserRole.DMMU, UserRole.NIC)
  @Get('members/:groupId')
  getMembers(@Param('groupId') groupId: string) {
    return this.voService.getMembers(groupId);
  }
}
