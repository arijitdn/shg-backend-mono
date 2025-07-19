import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '@app/common/db/entities/notifications.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from '../../dto/create-notification.dto'

@Injectable()
export class InAppService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async createNotification(dto: CreateNotificationDto) {
    const notification = this.notificationRepository.create(dto);
    return await this.notificationRepository.save(notification);
  }
}
