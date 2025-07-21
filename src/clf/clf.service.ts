import { Injectable } from '@nestjs/common';
import { CreateClfDto } from './dto/create-clf.dto';
import { UpdateClfDto } from './dto/update-clf.dto';
import { DbService } from '@app/db/db.service';

@Injectable()
export class ClfService {
  constructor(private dbService: DbService) {}

  async create(createClfDto: CreateClfDto) {
    const groupId = `CLF${Date.now().toString(36)}`;
    const clf = this.dbService.clfRepo.create({
      ...createClfDto,
      groupId,
    });
    return await this.dbService.clfRepo.save(clf);
  }

  async findAll() {
    return await this.dbService.clfRepo.find();
  }

  async findOne(id: string) {
    return await this.dbService.clfRepo.findOneBy({
      id,
    });
  }

  async update(id: string, updateClfDto: UpdateClfDto) {
    return await this.dbService.clfRepo.update(id, updateClfDto);
  }

  async remove(id: string) {
    return await this.dbService.clfRepo.delete(id);
  }
}
