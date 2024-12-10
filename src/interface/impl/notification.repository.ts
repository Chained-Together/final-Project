import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { INotificationRepository } from '../notification-interface';
import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>,
  ) {}
  createNotification(userId: number, message: string): NotificationEntity {
    return this.repository.create({
      userId,
      message,
    });
  }
  saveNotification(notification: NotificationEntity): Promise<NotificationEntity> {
    return this.repository.save(notification);
  }
  findAllNotificationByUserId(userId: number): Promise<NotificationEntity[]> {
    return this.repository.find({
      where: { userId, type: false },
      order: { createdAt: 'DESC' },
    });
  }
  updateNotification(notificationId: number): Promise<UpdateResult> {
    return this.repository.update({ id: notificationId }, { type: true });
  }
}
