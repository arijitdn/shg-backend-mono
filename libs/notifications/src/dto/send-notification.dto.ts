import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '@app/db/enums/notification-type.enum';

export class SendNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  to: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  message: string;
}
