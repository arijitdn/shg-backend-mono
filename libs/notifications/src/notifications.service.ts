import { Injectable } from '@nestjs/common';
import { EmailService } from './transports/email/email.service';
import { SmsService } from './transports/sms/sms.service';
import { InAppService } from './transports/in-app/in-app.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationType } from '@app/common/db/enums/notification-type.enum';

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly inAppService: InAppService,
  ) {}

  async send(dto: SendNotificationDto) {
    const { type, to, subject, message } = dto;

    switch (type) {
      case NotificationType.EMAIL:
        return this.emailService.sendMail({
          to,
          subject: subject || 'No Subject',
          html: message,
        });

      case NotificationType.SMS:
        return this.smsService.sendSMS(to, message);

      case NotificationType.IN_APP:
        return this.inAppService.createNotification({
          userId: to,
          title: subject || 'Notification',
          message,
          type,
        });

      default:
        throw new Error('Unsupported notification type');
    }
  }
}
