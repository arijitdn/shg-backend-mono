import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '@app/common/db/enums/notification-type.enum';

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  isRead?: boolean;
}
