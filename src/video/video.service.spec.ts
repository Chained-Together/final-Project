import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VideoEntity } from './entities/video.entity';
import { Repository } from 'typeorm';
import { ChannelEntity } from '../channel/entities/channel.entity';
import { UserEntity } from '../user/entities/user.entity';
import { Visibility } from './video.visibility.enum';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ResolutionEntity } from '../resolution/entities/resolution.entity';
import {
  getRepository,
  mockChannelRepository,
  mockQueryBuilder,
  mockResolutionRepository,
  mockVideoRepository,
} from './__mocks__/mock.video.service';
import {
  mockChannel,
  mockResolution,
  mockUpdatedVideo,
  mockUpdateVideoDto,
  mockUser,
  mockVideo,
  mockVideoDto,
  mockVideos,
} from './__mocks__/mock.video.data';

describe('VideoService', () => {
  let videoService: VideoService;
  let videoRepository: Repository<VideoEntity>;
  let channelRepository: Repository<ChannelEntity>;
  let resolutionRepository: Repository<ResolutionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: getRepositoryToken(VideoEntity),
          useValue: mockVideoRepository,
        },
        {
          provide: getRepositoryToken(ChannelEntity),
          useValue: mockChannelRepository,
        },

        {
          provide: getRepositoryToken(ResolutionEntity),
          useValue: mockResolutionRepository,
        },
      ],
    }).compile();

    videoService = module.get<VideoService>(VideoService);
    videoRepository = module.get<Repository<VideoEntity>>(getRepositoryToken(VideoEntity));
    channelRepository = module.get<Repository<ChannelEntity>>(getRepositoryToken(ChannelEntity));
    resolutionRepository = module.get<Repository<ResolutionEntity>>(
      getRepositoryToken(ChannelEntity),
    );
  });

  describe('영상 메타 데이터 저장 시 ', () => {
    it('유저가 소유한 채널이면 영상을 저장하고 반환한다.', async () => {
      // Arrange
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      mockVideoRepository.create.mockReturnValue(mockVideo as never);
      mockVideoRepository.save.mockResolvedValue(mockVideo);
      mockResolutionRepository.create.mockReturnValue(mockResolution);
      mockResolutionRepository.save.mockResolvedValue(mockResolution);

      // Act
      const result = await videoService.saveMetadata(mockUser, mockVideoDto);

      // Assert
      expect(channelRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
      });
      expect(videoRepository.create).toHaveBeenCalledWith({
        title: mockVideoDto.title,
        description: mockVideoDto.description,
        thumbnailUrl: mockVideoDto.thumbnailUrl,
        hashtags: mockVideoDto.hashtags,
        duration: null,
        visibility: mockVideoDto.visibility,
        channel: mockChannel,
        videoCode: mockVideo.videoCode,
        accessKey: mockVideoDto.visibility === Visibility.UNLISTED ? expect.any(String) : null,
      });
      expect(videoRepository.save).toHaveBeenCalledWith(mockVideo);

      expect(mockResolutionRepository.create).toHaveBeenCalledWith({
        high: mockVideoDto.high,
        low: mockVideoDto.low,
        video: mockVideo,
      });
      expect(mockResolutionRepository.save).toHaveBeenCalledWith(mockResolution);

      if (mockVideoDto.visibility === Visibility.UNLISTED) {
        expect(result).toEqual({
          key: mockVideo.videoCode,
          link: expect.stringContaining(`/video/${mockVideo.id}?accessKey=`),
        });
      } else {
        expect(result).toEqual({ key: mockVideo.videoCode });
      }
    });
  });
  describe('영상 전체 조회 시', () => {
    it('전체 조회 요청 시 영상 메타데이터 전체를 배열로 반환한다.', async () => {
      mockVideoRepository.find.mockResolvedValue([mockVideo]);
      const result = await videoService.getAllVideo();
      expect(videoRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockVideo]);
    });
  });

  describe('영상 상세 조회 시', () => {
    it('존재하지 않는 비디오에 대해 NotFoundException을 던져야합니다.', async () => {
      mockVideoRepository.findOne.mockResolvedValue(null);

      await expect(videoService.getVideo(1, mockUser.id)).rejects.toThrow(NotFoundException);
      expect(videoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['channel', 'resolution'],
      });
    });

    it('공개(PUBLIC) 영상이면 메타데이터와 채널 정보를 반환한다.', async () => {
      mockVideoRepository.findOne.mockResolvedValue({
        ...mockVideo,
        visibility: Visibility.PUBLIC,
      });
      const result = await videoService.getVideo(1, mockUser.id);

      expect(videoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['channel', 'resolution'],
      });
      expect(result).toEqual({ ...mockVideo, visibility: Visibility.PUBLIC });
    });

    it('비공개(PRIVATE) 영상 접근 시 소유자가 아니면 UnauthorizedException을 던져야합니다.', async () => {
      mockVideoRepository.findOne.mockResolvedValue({
        ...mockVideo,
        visibility: Visibility.PRIVATE,
        channel: { user: { id: 999 } },
      });

      await expect(videoService.getVideo(1, mockUser.id)).rejects.toThrow(UnauthorizedException);
    });
    it('비공개(PRIVATE) 영상일 때 소유자라면 메타데이터를 반환한다.', async () => {
      mockVideoRepository.findOne.mockResolvedValue({
        ...mockVideo,
        visibility: Visibility.PRIVATE,
        channel: { user: { id: mockUser.id } },
      });

      const result = await videoService.getVideo(1, mockUser.id);

      expect(result).toEqual({
        ...mockVideo,
        visibility: Visibility.PRIVATE,
        channel: { user: { id: mockUser.id } },
      });
    });

    it('잘못된 accessKey로 일부공개(UNLISTED) 영상 접근 시 UnauthorizedException을 던져야합니다.', async () => {
      mockVideoRepository.findOne.mockResolvedValue({
        ...mockVideo,
        visibility: Visibility.UNLISTED,
        accessKey: 'valid-key',
        channel: { user: { id: 999 } },
      });

      await expect(videoService.getVideo(1, mockUser.id, 'invalid-key')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('일부공개(UNLISTED) 영상일 때 accessKey가 올바르면 메타데이터를 반환한다.', async () => {
      mockVideoRepository.findOne.mockResolvedValue({
        ...mockVideo,
        visibility: Visibility.UNLISTED,
        accessKey: 'valid-key',
        channel: { user: { id: 999 } },
      });

      const result = await videoService.getVideo(1, mockUser.id, 'valid-key');

      expect(result).toEqual({
        ...mockVideo,
        visibility: Visibility.UNLISTED,
        accessKey: 'valid-key',
        channel: { user: { id: 999 } },
      });
    });
  });

  describe('영상 수정 시', () => {
    it('유저가 소유한 채널이 아닐 시 UnauthorizedException을 던져야 한다.', async () => {
      mockChannelRepository.findOne.mockResolvedValue(null);

      await expect(videoService.updateVideo(mockUser, 1, mockVideoDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('해당 비디오가 존재 하지 않을 시 NotFoundException을 던져야한다. ', async () => {
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      mockVideoRepository.findOne.mockResolvedValue(null);

      await expect(videoService.updateVideo(mockUser, 1, mockVideo)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('수정된 비디오 메타데이터를 반환한다.', async () => {
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      mockVideoRepository.findOne.mockResolvedValue(mockVideo);
      mockVideoRepository.update.mockResolvedValue(undefined);
      mockVideoRepository.findOne.mockResolvedValue(mockUpdatedVideo);

      const result = await videoService.updateVideo(mockUser, 1, mockUpdateVideoDto);

      expect(channelRepository.findOne).toHaveBeenLastCalledWith({
        where: { user: { id: mockUser.id } },
      });
      expect(videoRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(videoRepository.update).toHaveBeenCalledWith(
        { id: 1 },
        {
          title: mockUpdateVideoDto.title,
          description: mockUpdateVideoDto.description,
          thumbnailUrl: mockUpdateVideoDto.thumbnailUrl,
          hashtags: mockUpdateVideoDto.hashtags,
          visibility: mockUpdateVideoDto.visibility,
        },
      );
      expect(result).toEqual(mockUpdatedVideo);
    });
  });

  describe('영상 삭제 시', () => {
    it('유저가 소유한 채널이 아닐 시 UnauthorizedException을 던져야 한다.', async () => {
      mockChannelRepository.findOne.mockResolvedValue(null);

      await expect(videoService.deleteVideo(mockUser, 1)).rejects.toThrow(UnauthorizedException);
    });

    it('해당 비디오가 존재 하지 않을 시 NotFoundException을 던져야한다. ', async () => {
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      mockVideoRepository.findOne.mockResolvedValue(null);

      await expect(videoService.deleteVideo(mockUser, 1)).rejects.toThrow(NotFoundException);
    });

    it('비디오 삭제 시 메시지 반환', async () => {
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      mockVideoRepository.findOne.mockResolvedValue(mockVideo);
      mockVideoRepository.delete.mockResolvedValue(undefined);

      const result = await videoService.deleteVideo(mockUser, 1);

      expect(channelRepository.findOne).toHaveBeenLastCalledWith({
        where: { user: { id: mockUser.id } },
      });
      expect(videoRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(videoRepository.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ message: '동영상이 삭제되었습니다.' });
    });
  });

  describe('비디오 검색 시', () => {
    it('검색된 비디오를 반환한다.', async () => {
      mockQueryBuilder.getMany.mockResolvedValue(mockVideos);

      const result = await videoService.findVideoByKeyword('Test');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('video.title LIKE :keyword', {
        keyword: '%Test%',
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('video.status = :status', {
        status: Visibility.PUBLIC,
      });

      expect(mockQueryBuilder.orWhere).toHaveBeenCalledWith('video.hashtags @> :keywordArray', {
        keywordArray: JSON.stringify(['Test']),
      });
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();

      expect(result).toEqual(mockVideos);
    });
  });
});
