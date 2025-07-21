import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TRLMAdminEntity } from '@app/common/db/entities/trlm-admin.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(TRLMAdminEntity)
    private readonly employeeRepository: Repository<TRLMAdminEntity>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeeRepository.create(createEmployeeDto);
    return this.employeeRepository.save(employee);
  }

  async findAll() {
    return this.employeeRepository.find();
  }

  async findOne(id: string) {
    return this.employeeRepository.findOneBy({ id });
  }

  async findByPost(post: string) {
    return this.employeeRepository.find({ where: { post } });
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    await this.employeeRepository.update(id, updateEmployeeDto);
    return this.employeeRepository.findOneBy({ id });
  }

  async remove(id: string) {
    return this.employeeRepository.delete(id);
  }
}