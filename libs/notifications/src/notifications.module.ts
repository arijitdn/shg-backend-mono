import { Module } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { EmailModule } from './transports/email/email.module';
import { SmsModule } from './transports/sms/sms.module';
import { InAppModule } from './transports/in-app/in-app.module';

@Module({
  imports: [EmailModule, SmsModule, InAppModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
