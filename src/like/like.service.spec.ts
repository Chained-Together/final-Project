import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IChannelRepository } from 'src/interface/channel-interface';
import { ILikeRepository } from 'src/interface/like-interface';
import { NotificationService } from 'src/notification/notification.service';
import { mockChannel, mockDeleteResult, mockLike } from './__mocks__/mock.like.data';
import {
  mockChannelRepository,
  mockLikeRepository,
  mockNotificationService,
} from './__mocks__/mock.like.service';
import { LikeService } from './like.service';

describe('LikeService', () => {
  let likeService: LikeService;
  let likeRepository: ILikeRepository;
  let channelRepository: IChannelRepository;

  describe('LikeService', () => {
    let likeService: LikeService;
    let likeRepository: ILikeRepository;
    let channelRepository: IChannelRepository;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          LikeService,
          {
            provide: 'ILikeRepository',
            useValue: mockLikeRepository,
          },
          {
            provide: 'IChannelRepository',
            useValue: mockChannelRepository,
          },
          {
            provide: NotificationService,
            useValue: mockNotificationService,
          },
        ],
      }).compile();

      likeService = module.get<LikeService>(LikeService);
      likeRepository = module.get<ILikeRepository>('ILikeRepository');
      channelRepository = module.get<IChannelRepository>('IChannelRepository');
    });

    describe('toggleLike', () => {
      it('유저 ID 또는 비디오 ID가 없으면 BadRequestException을 던진다.', async () => {
        await expect(likeService.toggleLike(null, 123)).rejects.toThrow(
          new BadRequestException('유저 ID와 비디오 ID는 필수입니다.'),
        );
        await expect(likeService.toggleLike(1, null)).rejects.toThrow(
          new BadRequestException('유저 ID와 비디오 ID는 필수입니다.'),
        );
      });

      it('이미 좋아요 기록이 있다면 좋아요를 삭제한다.', async () => {
        mockLikeRepository.findLikeByUserIdAndVideoId.mockResolvedValue(mockLike);
        mockLikeRepository.deleteLike.mockResolvedValue(mockDeleteResult);

        const result = await likeService.toggleLike(1, 123);

        expect(likeRepository.findLikeByUserIdAndVideoId).toHaveBeenCalledWith(1, 123);
        expect(likeRepository.deleteLike).toHaveBeenCalledWith(1, 123);
        expect(result).toEqual(mockDeleteResult);
      });

      it('좋아요 기록이 없고, 채널이 존재하지 않으면 NotFoundException을 던진다.', async () => {
        mockLikeRepository.findLikeByUserIdAndVideoId.mockResolvedValue(null);
        mockChannelRepository.findChannelByVideoJoinUser.mockResolvedValue(null);

        await expect(likeService.toggleLike(1, 123)).rejects.toThrow(NotFoundException);

        expect(channelRepository.findChannelByVideoJoinUser).toHaveBeenCalledWith(123);
      });

      it('좋아요 기록이 없으면 좋아요를 저장한다.', async () => {
        mockLikeRepository.findLikeByUserIdAndVideoId.mockResolvedValue(null);
        mockChannelRepository.findChannelByVideoJoinUser.mockResolvedValue(mockChannel);
        mockLikeRepository.saveLike.mockResolvedValue(mockLike);

        const result = await likeService.toggleLike(1, 123);

        expect(likeRepository.findLikeByUserIdAndVideoId).toHaveBeenCalledWith(1, 123);
        expect(channelRepository.findChannelByVideoJoinUser).toHaveBeenCalledWith(123);
        expect(likeRepository.saveLike).toHaveBeenCalledWith(1, 123);
        expect(result).toEqual(mockLike);
      });
    });

    describe('getLikes', () => {
      it('좋아요 총 갯수를 가져온다.', async () => {
        mockLikeRepository.countLike.mockResolvedValue(10);

        const result = await likeService.getLikes(123);

        expect(likeRepository.countLike).toHaveBeenCalledWith(123);
        expect(result).toBe(10);
      });

      it('비디오 ID가 없으면 BadRequestException을 던진다.', async () => {
        await expect(likeService.getLikes(null)).rejects.toThrow(BadRequestException);
      });
    });
  });
});
