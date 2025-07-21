import { Injectable } from '@nestjs/common';
import { CreateShgDto } from './dto/create-shg.dto';
import { UpdateShgDto } from './dto/update-shg.dto';
import { DbService } from '@app/db/db.service';

@Injectable()
export class ShgService {
  constructor(private dbService: DbService) {}

  async create(createShgDto: CreateShgDto) {
    const groupId = `SHG${Date.now().toString(36)}`;
    const shg = this.dbService.shgRepo.create({ ...createShgDto, groupId });
    return await this.dbService.shgRepo.save(shg);
  }

  async findAll() {
    return await this.dbService.shgRepo.find();
  }

  async findOne(id: string) {
    return await this.dbService.shgRepo.findOneBy({
      groupId: id,
    });
  }

  async update(id: string, updateShgDto: UpdateShgDto) {
    return await this.dbService.shgRepo.update(id, updateShgDto);
  }

  async remove(id: string) {
    return await this.dbService.shgRepo.delete(id);
  }
}
