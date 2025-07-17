import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notifications.service'
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async sendNotification(@Body() dto: SendNotificationDto) {
    return this.notificationService.send(dto);
  }
}
