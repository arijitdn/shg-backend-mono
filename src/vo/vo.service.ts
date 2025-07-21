import { Injectable } from '@nestjs/common';
import { DbService } from '@app/db/db.service';
import { CreateVoDto } from './dto/create-vo.dto';
import { UpdateVoDto } from './dto/update-vo.dto';

@Injectable()
export class VoService {
  constructor(private dbService: DbService) {}

  async create(createVoDto: CreateVoDto) {
    const groupId = `VO${Date.now().toString(36)}`;
    const vo = this.dbService.voRepo.create({
      ...createVoDto,
      groupId,
    });
    return await this.dbService.voRepo.save(vo);
  }

  async findAll() {
    return await this.dbService.voRepo.find();
  }

  async findOne(id: string) {
    return await this.dbService.voRepo.findOneBy({
      id,
    });
  }

  async update(id: string, updateVoDto: UpdateVoDto) {
    return await this.dbService.voRepo.update(id, updateVoDto);
  }

  async remove(id: string) {
    return await this.dbService.voRepo.delete(id);
  }
}
