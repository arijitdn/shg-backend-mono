import { Injectable } from '@nestjs/common';
import { DbService } from '@app/db/db.service';
import { CreateVoDto } from './dto/create-vo.dto';
import { UpdateVoDto } from './dto/update-vo.dto';

@Injectable()
export class VoService {
  constructor(private dbService: DbService) {}

  async create(createVoDto: CreateVoDto) {
    const groupId = `VO${Math.floor(1000 + Math.random() * 9000).toString()}`;
    const vo = this.dbService.voRepo.create({
      ...createVoDto,
      groupId,
    });
    return await this.dbService.voRepo.save(vo);
  }

  async findAll() {
    return await this.dbService.voRepo.find();
  }

  async findOne(groupId: string) {
    return await this.dbService.voRepo.findOneBy({
      groupId,
    });
  }

  async update(groupId: string, updateVoDto: UpdateVoDto) {
    return await this.dbService.voRepo.update(groupId, updateVoDto);
  }

  async remove(groupId: string) {
    return await this.dbService.voRepo.delete(groupId);
  }
}
