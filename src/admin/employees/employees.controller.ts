import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from 'src/shg-auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shg-auth/guards/roles-guard';
import { Roles } from 'src/shg-auth/decorators/roles.decorator';
import { UserRole } from '@app/common/db/enums/user-role.enum';

// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.NIC_ADMIN)
@Controller('admin/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post('create')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Get('by-post/:post')
  findByPost(@Param('post') post: string) {
    return this.employeesService.findByPost(post);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
