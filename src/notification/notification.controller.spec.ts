import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { JwtQueryAuthGuard } from 'src/utils/jwtquery-authguard';
import { mockNotification, mockUser } from './__mocks__/mock.notification.data';
import { mockNotificationService } from './__mocks__/mock.notification.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let notificationController: NotificationController;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    })
      .overrideGuard(JwtQueryAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    notificationController = module.get<NotificationController>(NotificationController);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(notificationController).toBeDefined();
  });

  describe('stream', () => {
    it('알림 스크림을 반환해야 합니다.', (done) => {
      const mockMessage = '알림 테스트';

      mockNotificationService.getNotificationStream.mockReturnValue(of(mockMessage));

      const stream = notificationController.stream(mockUser);

      stream.subscribe((event) => {
        expect(event).toEqual({
          data: { message: mockMessage },
        });
        done();
      });
    });
  });

  describe('removeNotification', () => {
    it('ID에 해당하는 알림을 읽음 처리해야 합니다.', async () => {
      mockNotificationService.updateNotification.mockResolvedValue(undefined);

      await notificationController.updateNotification(mockNotification.id);
      expect(mockNotificationService.updateNotification).toHaveBeenCalledWith(1);
    });
  });

  describe('getPastNotifications', () => {
    it('유저의 과거 알람을 반환해야 합니다.', async () => {
      mockNotificationService.getPastNotifications.mockResolvedValue(mockNotification);

      await notificationController.getPastNotifications(mockUser);
      expect(mockNotificationService.getPastNotifications).toHaveBeenCalledWith(1);
    });
  });
});
