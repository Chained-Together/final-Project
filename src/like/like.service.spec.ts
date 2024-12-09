import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from './like.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LikeEntity } from './entities/like.entity';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mockLikeRepository, mockChannelRepository, mockNotificationService } from './__mocks__/mock.like.service';
import { mockLike, mockChannel, mockDeleteResult } from './__mocks__/mock.like.data';
import { NotificationService } from 'src/notification/notification.service';

describe('LikeService', () => {
  let likeService: LikeService;
  let likeRepository: Repository<LikeEntity>;
  let channelRepository: Repository<ChannelEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        {
          provide: getRepositoryToken(LikeEntity),
          useValue: mockLikeRepository,
        },
        {
          provide: getRepositoryToken(ChannelEntity),
          useValue: mockChannelRepository,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    likeService = module.get<LikeService>(LikeService);
    likeRepository = module.get<Repository<LikeEntity>>(getRepositoryToken(LikeEntity));
    channelRepository = module.get<Repository<ChannelEntity>>(getRepositoryToken(ChannelEntity));
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
      mockLikeRepository.findOne.mockResolvedValue(mockLike);
      mockLikeRepository.delete.mockResolvedValue(mockDeleteResult);

      const result = await likeService.toggleLike(1, 123);

      expect(likeRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: 1 }, video: { id: 123 } },
      });
      expect(likeRepository.delete).toHaveBeenCalledWith({
        user: { id: 1 },
        video: { id: 123 },
      });
      expect(result).toEqual(mockDeleteResult);
    });

    it('좋아요 기록이 없고, 채널이 존재하지 않으면 NotFoundException을 던진다.', async () => {
      mockLikeRepository.findOne.mockResolvedValue(null);
      mockChannelRepository.findOne.mockResolvedValue(null);

      await expect(likeService.toggleLike(1, 123)).rejects.toThrow(
        new NotFoundException('비디오와 연결된 채널을 찾을 수 없습니다.'),
      );

      expect(channelRepository.findOne).toHaveBeenCalledWith({
        where: { video: { id: 123 } },
        relations: ['user'],
      });
    });

    it('좋아요 기록이 없으면 좋아요를 저장한다.', async () => {
      mockLikeRepository.findOne.mockResolvedValue(null);
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      mockLikeRepository.save.mockResolvedValue(mockLike);

      const result = await likeService.toggleLike(1, 123);

      expect(likeRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: { id: 1 },
          video: { id: 123 },
        },
      });
      expect(channelRepository.findOne).toHaveBeenCalledWith({
        where: { video: { id: 123 } },
        relations: ['user'],
      });
      expect(likeRepository.save).toHaveBeenCalledWith({
        user: { id: 1 },
        video: { id: 123 },
      });

      expect(result).toEqual(mockLike);
    });
  });

  describe('getLikes', () => {
    it('좋아요 총 갯수를 가져온다.', async () => {
      mockLikeRepository.count.mockResolvedValue(mockLike.video);

      const result = await likeService.getLikes(123);

      expect(likeRepository.count).toHaveBeenCalledWith({
        where: {
          video: { id: 123 },
        },
      });

      expect(result).toEqual(mockLike.video);
    });
  });
});
