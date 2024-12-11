import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IChannelRepository } from 'src/interface/channel-interface';
import { IResolutionRepository } from 'src/interface/resolution-interface';
import { IVideoRepository } from 'src/interface/video-interface';
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
import {
  mockChannelRepository,
  mockQueryBuilder,
  mockResolutionRepository,
  mockVideoRepository,
} from './__mocks__/mock.video.service';
import { VideoService } from './video.service';
import { Visibility } from './video.visibility.enum';

describe('VideoService', () => {
  let videoService: VideoService;
  let videoRepository: IVideoRepository;
  let channelRepository: IChannelRepository;
  let resolutionRepository: IResolutionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: 'IVideoRepository',
          useValue: mockVideoRepository,
        },
        {
          provide: 'IChannelRepository',
          useValue: mockChannelRepository,
        },

        {
          provide: 'IResolutionRepository',
          useValue: mockResolutionRepository,
        },
      ],
    }).compile();

    videoService = module.get<VideoService>(VideoService);
    videoRepository = module.get<IVideoRepository>('IVideoRepository');
    channelRepository = module.get<IChannelRepository>('IChannelRepository');
    resolutionRepository = module.get<IResolutionRepository>('IResolutionRepository');
  });

  describe('영상 메타 데이터 저장 시 ', () => {
    it('유저가 소유한 채널이면 영상을 저장하고 반환한다.', async () => {
      mockChannelRepository.findChannelByUserId.mockResolvedValue(mockChannel);
      mockVideoRepository.createVideo.mockReturnValue(mockVideo);
      mockVideoRepository.saveVideo.mockResolvedValue(mockVideo);
      mockResolutionRepository.createResolution.mockReturnValue(mockResolution);
      mockResolutionRepository.saveResolution.mockResolvedValue(mockResolution);

      const result = await videoService.saveMetadata(mockUser, mockVideoDto);

      expect(channelRepository.findChannelByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(videoRepository.createVideo).toHaveBeenCalledWith(
        mockVideoDto.title,
        mockVideoDto.description,
        mockVideoDto.thumbnailUrl,
        mockVideoDto.hashtags,
        null,
        mockVideoDto.visibility,
        mockChannel,
        mockVideo.videoCode,
        mockVideoDto.visibility === Visibility.UNLISTED ? expect.any(String) : null,
      );
      expect(videoRepository.saveVideo).toHaveBeenCalledWith(mockVideo);

      expect(mockResolutionRepository.createResolution).toHaveBeenCalledWith(
        mockVideoDto.high,
        mockVideoDto.low,
        mockVideo,
      );
      expect(mockResolutionRepository.saveResolution).toHaveBeenCalledWith(mockResolution);

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
      mockVideoRepository.findAllVideo.mockResolvedValue([mockVideo]);
      const result = await videoService.getAllVideo();
      expect(videoRepository.findAllVideo).toHaveBeenCalled();
      expect(result).toEqual([mockVideo]);
    });
  });

  describe('영상 상세 조회 시', () => {
    it('존재하지 않는 비디오에 대해 NotFoundException을 던져야합니다.', async () => {
      mockVideoRepository.findVideoWithChannelAndResolution.mockResolvedValue(null);

      await expect(videoService.getVideo(1, mockUser.id)).rejects.toThrow(NotFoundException);
      expect(videoRepository.findVideoWithChannelAndResolution).toHaveBeenCalledWith(1);
    });

    it('공개(PUBLIC) 영상이면 메타데이터와 채널 정보를 반환한다.', async () => {
      mockVideoRepository.findVideoWithChannelAndResolution.mockResolvedValue({
        ...mockVideo,
        visibility: Visibility.PUBLIC,
      });
      const result = await videoService.getVideo(1, mockUser.id);

      expect(videoRepository.findVideoWithChannelAndResolution).toHaveBeenCalledWith(1);
      expect(result).toEqual({ ...mockVideo, visibility: Visibility.PUBLIC });
    });

    it('비공개(PRIVATE) 영상 접근 시 소유자가 아니면 UnauthorizedException을 던져야합니다.', async () => {
      mockVideoRepository.findVideoWithChannelAndResolution.mockResolvedValue({
        ...mockVideo,
        visibility: Visibility.PRIVATE,
        channel: { user: { id: 999 } },
      });

      await expect(videoService.getVideo(1, mockUser.id)).rejects.toThrow(UnauthorizedException);
    });
    it('비공개(PRIVATE) 영상일 때 소유자라면 메타데이터를 반환한다.', async () => {
      mockVideoRepository.findVideoWithChannelAndResolution.mockResolvedValue({
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
      mockVideoRepository.findVideoWithChannelAndResolution.mockResolvedValue({
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
      mockVideoRepository.findVideoWithChannelAndResolution.mockResolvedValue({
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
      mockChannelRepository.findChannelByUserId.mockResolvedValue(null);

      await expect(videoService.updateVideo(mockUser, 1, mockVideoDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('해당 비디오가 존재 하지 않을 시 NotFoundException을 던져야한다. ', async () => {
      mockChannelRepository.findChannelByUserId.mockResolvedValue(mockChannel);
      mockVideoRepository.findVideoByVideoId.mockResolvedValue(null);

      await expect(videoService.updateVideo(mockUser, 1, mockVideo)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('수정된 비디오 메타데이터를 반환한다.', async () => {
      mockChannelRepository.findChannelByUserId.mockResolvedValue(mockChannel);
      mockVideoRepository.findVideoByVideoId.mockResolvedValue(mockVideo);
      mockVideoRepository.updateVideo.mockResolvedValue(undefined);
      mockVideoRepository.findVideoByVideoId.mockResolvedValue(mockUpdatedVideo);

      const result = await videoService.updateVideo(mockUser, 1, mockUpdateVideoDto);

      expect(channelRepository.findChannelByUserId).toHaveBeenLastCalledWith(mockUser.id);
      expect(videoRepository.findVideoByVideoId).toHaveBeenCalledWith(1);
      expect(videoRepository.updateVideo).toHaveBeenCalledWith(1, {
        title: mockUpdateVideoDto.title,
        description: mockUpdateVideoDto.description,
        thumbnailUrl: mockUpdateVideoDto.thumbnailUrl,
        hashtags: mockUpdateVideoDto.hashtags,
        visibility: mockUpdateVideoDto.visibility,
      });
      expect(result).toEqual(mockUpdatedVideo);
    });
  });

  describe('영상 삭제 시', () => {
    it('유저가 소유한 채널이 아닐 시 UnauthorizedException을 던져야 한다.', async () => {
      mockChannelRepository.findChannelByUserId.mockResolvedValue(null);

      await expect(videoService.deleteVideo(mockUser, 1)).rejects.toThrow(UnauthorizedException);
    });

    it('해당 비디오가 존재 하지 않을 시 NotFoundException을 던져야한다. ', async () => {
      mockChannelRepository.findChannelByUserId.mockResolvedValue(mockChannel);
      mockVideoRepository.findVideoByVideoId.mockResolvedValue(null);

      await expect(videoService.deleteVideo(mockUser, 1)).rejects.toThrow(NotFoundException);

      expect(channelRepository.findChannelByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(videoRepository.findVideoByVideoId).toHaveBeenCalledWith(1);
    });

    it('비디오 삭제 시 메시지 반환', async () => {
      mockChannelRepository.findChannelByUserId.mockResolvedValue(mockChannel);
      mockVideoRepository.findVideoByVideoId.mockResolvedValue(mockVideo);
      mockVideoRepository.deleteVideo.mockResolvedValue({ affacted: 1 });

      const result = await videoService.deleteVideo(mockUser, 1);

      expect(channelRepository.findChannelByUserId).toHaveBeenLastCalledWith(mockUser.id);
      expect(videoRepository.findVideoByVideoId).toHaveBeenCalledWith(1);
      expect(videoRepository.deleteVideo).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: '동영상이 삭제되었습니다.' });
    });
  });

  describe('findVideoByKeyword', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockVideoRepository.findByKeyword.mockImplementation(() => mockQueryBuilder.getMany());
    });

    it('검색된 비디오를 반환한다.', async () => {
      mockVideoRepository.findByKeyword.mockResolvedValue(mockVideos);

      const result = await videoService.findVideoByKeyword('Test');

      expect(mockVideoRepository.findByKeyword).toHaveBeenCalledWith('Test');
      expect(result).toEqual(mockVideos);
    });
  });
});
