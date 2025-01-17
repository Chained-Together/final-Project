import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { Repository, UpdateResult } from 'typeorm';
import { INotificationRepository } from '../notification-interface';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>,
  ) {}
  createNotification(userId: number, message: string): Promise<NotificationEntity> {
    const notification = this.repository.create({
      userId,
      message,
    });
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
