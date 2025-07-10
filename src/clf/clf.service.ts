import { Injectable } from '@nestjs/common';
import { CreateClfDto } from './dto/create-clf.dto';
import { UpdateClfDto } from './dto/update-clf.dto';

@Injectable()
export class ClfService {
  create(createClfDto: CreateClfDto) {
    return 'This action adds a new clf';
  }

  findAll() {
    return `This action returns all clf`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clf`;
  }

  update(id: number, updateClfDto: UpdateClfDto) {
    return `This action updates a #${id} clf`;
  }

  remove(id: number) {
    return `This action removes a #${id} clf`;
  }
}
