import { Injectable } from '@nestjs/common';
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
      this.users = new ReplaySubject<{ userId: number; message: string }>(1);
    }
  }

  async emitNotification(message: string, videoId: number) {
    const foundChannel = await this.channelRepository.findOne({
      where: { video: { id: videoId } },
      relations: ['user'],
    });

    if (!foundChannel || !foundChannel.user) {
      console.error('Channel 또는 User를 찾을 수 없습니다.');
      return;
    }

    const userId = foundChannel.user.id;
    this.eventEmitter.emit(`notification:${userId}`, message);
    this.notificationRepository.save({
      userId,
      message: message,
    });
  }

  getNotificationStream(userId: number): Observable<string> {
    console.log(`SSE 스트림 생성 for userId: ${userId}`);
    return new Observable<string>((subscriber) => {
      const handler = (message: string) => {
        console.log(`알림 전송 to userId: ${userId} -> ${message}`);
        subscriber.next(message);
      };

      // 이벤트 등록
      this.eventEmitter.on(`notification:${userId}`, handler);

      // 클라이언트가 연결을 끊을 때 이벤트 제거
      return () => {
        this.eventEmitter.off(`notification:${userId}`, handler);
        console.log(`SSE 스트림 종료 for userId: ${userId}`);
      };
    });
  }
}
