import { Injectable } from '@nestjs/common';
import { CreateShgDto } from './dto/create-shg.dto';
import { UpdateShgDto } from './dto/update-shg.dto';
import { DbService } from '@app/db/db.service';

@Injectable()
export class ShgService {
  constructor(private dbService: DbService) {}

  async create(createShgDto: CreateShgDto) {
    const groupId = `SHG${Math.floor(1000 + Math.random() * 9000).toString()}`;
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

  async getMembers(organizationId: string) {
    return this.dbService.userRepo.find({
      where: { organizationId },
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
