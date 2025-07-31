import { Injectable } from '@nestjs/common';
import { CreateClfDto } from './dto/create-clf.dto';
import { UpdateClfDto } from './dto/update-clf.dto';
import { DbService } from '@app/db/db.service';

@Injectable()
export class ClfService {
  constructor(private dbService: DbService) {}

  async create(createClfDto: CreateClfDto) {
    const groupId = `CLF${Math.floor(1000 + Math.random() * 9000).toString()}`;
    const clf = this.dbService.clfRepo.create({
      ...createClfDto,
      groupId,
    });
    return await this.dbService.clfRepo.save(clf);
  }

  async findAll() {
    return await this.dbService.clfRepo.find();
  }

  async findOne(groupId: string) {
    return await this.dbService.clfRepo.findOneBy({
      groupId,
    });
  }

  async update(groupId: string, updateClfDto: UpdateClfDto) {
    return await this.dbService.clfRepo.update(groupId, updateClfDto);
  }

  async remove(groupId: string) {
    return await this.dbService.clfRepo.delete(groupId);
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
