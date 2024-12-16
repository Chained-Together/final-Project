import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { UpdateResult } from 'typeorm';

export interface INotificationRepository {
  createNotification(userId: number, message: string): Promise<NotificationEntity>;
  // saveNotification(notification: NotificationEntity): Promise<NotificationEntity>;
  findAllNotificationByUserId(userId: number): Promise<NotificationEntity[]>;
  updateNotification(notificationId: number): Promise<UpdateResult>;
}
