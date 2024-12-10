import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, ReplaySubject } from 'rxjs';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { IChannelRepository } from 'src/interface/channel-interface';
import { INotificationRepository } from 'src/interface/notification-interface';

@Injectable()
export class NotificationService {
  private users = new ReplaySubject<{ userId: number; message: string }>(1);

  constructor(
    @Inject('IChannelRepository')
    private readonly channelRepository: IChannelRepository,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {
    if (!this.users) {
      this.users = new ReplaySubject<{ id: number; userId: number; message: string }>(1);
    }
  }

  async emitNotification(message: string, videoId: number) {
    const foundChannel = await this.channelRepository.findChannelByVideoJoinUser(videoId);

    if (!foundChannel || !foundChannel.user) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }
    const userId = foundChannel.user.id;

    const createNotification = this.notificationRepository.createNotification(userId, message);

    const saveNotification = await this.notificationRepository.saveNotification(createNotification);

    this.eventEmitter.emit(`notification:${userId}`, {
      message,
      id: saveNotification.id,
    });
  }

  getNotificationStream(userId: number): Observable<any> {
    console.log(`SSE 스트림 생성 for userId: ${userId}`);
    return new Observable<any>((subscriber) => {
      const handler = (data: { message: string; id: number }) => {
        subscriber.next(data);
      };

      this.eventEmitter.on(`notification:${userId}`, handler);

      return () => {
        this.eventEmitter.off(`notification:${userId}`, handler);
        console.log(`SSE 스트림 종료 for userId: ${userId}`);
      };
    });
  }

  async getPastNotifications(userId: number) {
    const pastNotifications = await this.notificationRepository.findAllNotificationByUserId(userId);

    const data = pastNotifications.map((pastNotification) => ({
      message: `받은 알림: {message: ${pastNotification.message}}`,
      id: pastNotification.id,
    }));

    return data;
  }

  async updateNotification(id: number) {
    await this.notificationRepository.updateNotification(id);

    return { message: '알림 삭제가 완료 되었습니다.' };
  }
}
