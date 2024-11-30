import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, ReplaySubject } from 'rxjs';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  private users = new ReplaySubject<{ userId: number; message: string }>(1);

  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    if (!this.users) {
      this.users = new ReplaySubject<{ id: number; userId: number; message: string }>(1);
    }
  }

  async emitNotification(message: string, videoId: number) {
    const foundChannel = await this.channelRepository.findOne({
      where: { video: { id: videoId } },
      relations: ['user'],
    });

    if (!foundChannel || !foundChannel.user) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }
    const userId = foundChannel.user.id;

    const createNotification = this.notificationRepository.create({
      userId,
      message: message,
    });

    const saveNotification = await this.notificationRepository.save(createNotification);

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

      // 이벤트 등록
      this.eventEmitter.on(`notification:${userId}`, handler);

      return () => {
        this.eventEmitter.off(`notification:${userId}`, handler);
        console.log(`SSE 스트림 종료 for userId: ${userId}`);
      };
    });
  }

  async getPastNotifications(userId: number) {
    const pastNotifications = await this.notificationRepository.find({
      where: { userId, type: false },
      order: { createdAt: 'DESC' },
    });

    const data = pastNotifications.map((pastNotification) => ({
      message: `받은 알림: {message: ${pastNotification.message}}`,
      id: pastNotification.id,
    }));

    return data;
  }

  async updateNotification(id: number) {
    await this.notificationRepository.update({ id: id }, { type: true });

    return { message: '알림 삭제가 완료 되었습니다.' };
  }
}
