import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TRLMAdminEntity, TRLMLevel } from '@app/db/entities/trlm-admin.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(TRLMAdminEntity)
    private readonly employeeRepository: Repository<TRLMAdminEntity>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);

    const employeeData = {
      name: createEmployeeDto.name,
      email: createEmployeeDto.email,
      phone: createEmployeeDto.phone,
      password: hashedPassword,
      designation: createEmployeeDto.designation,
      postId: createEmployeeDto.postId,
      level: createEmployeeDto.level as TRLMLevel,
      status: createEmployeeDto.status || 'active',
      joinDate: createEmployeeDto.joinDate
        ? new Date(createEmployeeDto.joinDate)
        : new Date(),
    };

    const employee = this.employeeRepository.create(employeeData);
    return this.employeeRepository.save(employee);
  }

  async findAll() {
    return this.employeeRepository.find();
  }

  async findOne(id: string) {
    return this.employeeRepository.findOneBy({ id });
  }

  async findByPost(postId: string) {
    return this.employeeRepository.find({ where: { postId } });
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const updateData: Partial<TRLMAdminEntity> = {};

    // Only include fields that are being updated
    if (updateEmployeeDto.name !== undefined)
      updateData.name = updateEmployeeDto.name;
    if (updateEmployeeDto.email !== undefined)
      updateData.email = updateEmployeeDto.email;
    if (updateEmployeeDto.phone !== undefined)
      updateData.phone = updateEmployeeDto.phone;
    if (updateEmployeeDto.designation !== undefined)
      updateData.designation = updateEmployeeDto.designation;
    if (updateEmployeeDto.postId !== undefined)
      updateData.postId = updateEmployeeDto.postId;
    if (updateEmployeeDto.status !== undefined)
      updateData.status = updateEmployeeDto.status;
    if (updateEmployeeDto.level !== undefined)
      updateData.role = updateEmployeeDto.level as TRLMLevel;

    // Hash password if it's being updated
    if (updateEmployeeDto.password) {
      updateData.password = await bcrypt.hash(updateEmployeeDto.password, 10);
    }

    // Convert string joinDate to Date if provided
    if (updateEmployeeDto.joinDate) {
      updateData.joinDate = new Date(updateEmployeeDto.joinDate);
    }

    await this.employeeRepository.update(id, updateData);
    return this.employeeRepository.findOneBy({ id });
  }

  async remove(id: string) {
    return this.employeeRepository.delete(id);
  }
}
