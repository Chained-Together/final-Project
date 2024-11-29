import { NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { Repository } from 'typeorm';
import { mockChannel, mockNotification, mockVideo } from './__mocks__/mock.notification.data';
import {
  mockChannelRepository,
  mockEventEmitter,
  mockNotificationRepository,
} from './__mocks__/mock.notification.service';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let channelRepository: Repository<ChannelEntity>;
  let notificationRepository: Repository<NotificationEntity>;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(ChannelEntity),
          useValue: mockChannelRepository,
        },
        {
          provide: getRepositoryToken(NotificationEntity),
          useValue: mockNotificationRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
    channelRepository = module.get<Repository<ChannelEntity>>(getRepositoryToken(ChannelEntity));
    notificationRepository = module.get<Repository<NotificationEntity>>(
      getRepositoryToken(NotificationEntity),
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(notificationService).toBeDefined();
  });

  describe('emitNotification', () => {
    it('특정 비디오와 연결된 채널 소유자에게 알림을 전송합니다.', async () => {
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      mockNotificationRepository.create.mockResolvedValue(mockNotification);
      mockNotificationRepository.save.mockResolvedValue(mockNotification);
      mockEventEmitter.emit;

      await notificationService.emitNotification('message Test', 1);

      expect(channelRepository.findOne).toHaveBeenCalledWith({
        where: { video: { id: 1 } },
        relations: ['user'],
      });
      expect(notificationRepository.create).toHaveBeenCalledWith({
        message: 'message Test',
        userId: mockChannel.user.id,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(`notification:${mockChannel.user.id}`, {
        message: 'message Test',
        id: mockNotification.id,
      });
    });

    it('채널 또는 채널 소유자를 찾을 수 없다면 NotFoundException 처리합니다.', async () => {
      mockChannelRepository.findOne.mockResolvedValue(null);

      await expect(notificationService.emitNotification('message Test', 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getNotificationStream', () => {
    it('특정 사용자의 실시간 알림 스트림을 생성합니다.', () => {
      mockEventEmitter.on.mockImplementation((event, handler) => {
        if (event === `notification:${1}`) {
          handler({ message: 'test', id: 1 });
        }
      });
      mockEventEmitter.off;

      const observable = notificationService.getNotificationStream(1);
      let subscription;
      subscription = observable.subscribe((data) => {
        expect(data).toEqual({ message: 'test', id: 1 });
      });

      subscription.unsubscribe();
      expect(mockEventEmitter.on).toHaveBeenCalledWith(`notification:${1}`, expect.any(Function));
    });
  });

  describe('getPastNotifications', () => {
    it('특정 사용자의 과거 알림 기록을 조회합니다.', async () => {
      mockNotificationRepository.find.mockResolvedValue([{ id: 1, message: 'test' }]);
      const result = await notificationService.getPastNotifications(1);
      expect(result).toEqual([
        {
          message: '받은 알림: {message: test}',
          id: 1,
        },
      ]);
      expect(notificationRepository.find).toHaveBeenCalledWith({
        where: { userId: 1, type: false },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('updateNotification', () => {
    it('특정 ID를 가진 알림을 읽음 처리합니다.', async () => {
      mockNotificationRepository.update.mockResolvedValue({ id: mockVideo.id });

      const result = await notificationService.updateNotification(1);

      expect(notificationRepository.update).toHaveBeenCalledWith({ id: 1 }, { type: true });
      expect(result).toEqual({ message: '알림 삭제가 완료 되었습니다.' });
    });
  });
});
