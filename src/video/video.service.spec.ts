import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VideoEntity } from './entities/video.entity';
import { Repository } from 'typeorm';
import { ChannelEntity } from '../channel/entities/channel.entity';
import { UserEntity } from '../user/entity/user.entity';
import { Visibility } from './video.visibility.enum';
import { VideoDto } from './dto/video.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { create } from 'lodash';
import { UpdateVideoDto } from './dto/update.video.dto';

const mockVideoRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockChannelRepository = {
  findOne: jest.fn(),
};

describe('VideoService', () => {
  let videoService: VideoService;
  let videoRepository: Repository<VideoEntity>;
  let channelRepository: Repository<ChannelEntity>;

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
      ],
    }).compile();

    videoService = module.get<VideoService>(VideoService);
    videoRepository = module.get<Repository<VideoEntity>>(getRepositoryToken(VideoEntity));
    channelRepository = module.get<Repository<ChannelEntity>>(getRepositoryToken(ChannelEntity));
  });

  const mockUser: UserEntity = {
    id: 1,
    email: 'test@test.com',
    password: 'testtest',
    name: 'test',
    nickname: 'test',
    phoneNumber: '010-4444-4444',
    likes: null,
  };

  const mockChannel: ChannelEntity = {
    id: 1,
    name: 'testTV',
    profileImage: 'test',
    userId: 1,
    video: null,
  };

  const mockVideo: VideoEntity = {
    id: 1,
    title: 'test',
    description: 'test',
    thumbnailURL: 'test',
    hashtags: ['공포', '강아지'],
    visibility: Visibility.PUBLIC,
    duration: 10,
    views: 0,
    uploadedAt: new Date(),
    updatedAt: null,
    resolution: null,
    channel: mockChannel,
    likes: null,
  };

  const mockVideoDto: VideoDto = {
    title: 'test',
    description: 'test',
    thumbnailURL: 'test',
    duration: 10,
    hashtags: ['공포', '강아지'],
    visibility: Visibility.PUBLIC,
  };

  const mockUpdateVideoDto: UpdateVideoDto = {
    title: 'test',
    description: 'test',
    thumbnailURL: 'test',
    hashtags: ['공포', '고양이'],
    visibility: Visibility.PUBLIC,
  };

  const mockUpdatedVideo: VideoEntity = {
    id: 1,
    title: 'test',
    description: 'test',
    thumbnailURL: 'test',
    hashtags: ['공포', '고양이'],
    visibility: Visibility.PUBLIC,
    duration: 10,
    views: 0,
    uploadedAt: new Date(),
    updatedAt: null,
    resolution: null,
    channel: mockChannel,
    likes: null,
  };

  describe('영상 생성 시', () => {
    it('유저가 소유한 채널이 없으면 UnauthorizedException을 반환해야 한다.', async () => {
      mockChannelRepository.findOne.mockResolvedValue(null);
      await expect(videoService.createVideo(mockUser, mockVideoDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('유저가 소유한 채널이면 영상을 저장하고 반환한다. ', async () => {
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      mockVideoRepository.create.mockReturnValue(mockVideo as never);
      mockVideoRepository.save.mockResolvedValue(mockVideo);

      const result = await videoService.createVideo(mockUser, mockVideoDto);
      expect(channelRepository.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.id } });
      expect(videoRepository.create).toHaveBeenCalledWith({
        ...mockVideoDto,
        channel: mockChannel,
      });
      expect(videoRepository.save).toHaveBeenCalledWith(mockVideo);
      expect(result).toEqual(mockVideo);
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
    it('해당 영상이 없으면 NotFoundException을 반환해야 한다.', async () => {
      mockVideoRepository.findOne.mockResolvedValue(null);
      await expect(videoService.getVideo(1)).rejects.toThrow(NotFoundException);
    });

    it('해당 영상이 존재 하면 영상 메타데이터와 채널 정보를 반환한다. ', async () => {
      mockVideoRepository.findOne.mockResolvedValue(mockVideo);
      const result = await videoService.getVideo(1);

      expect(videoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['channel'],
      });
      expect(result).toEqual(mockVideo);
    });
  });

  describe('영상 수정 시', () => {
    it('유저가 소유한 채널이 아닐 시 UnauthorizedException을 반환해야 한다.', async () => {
      mockChannelRepository.findOne.mockResolvedValue(null);

      await expect(videoService.updateVideo(mockUser, 1, mockVideoDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('해당 비디오가 존재 하지 않을 시 NotFoundException을 반환한다. ', async () => {
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      mockVideoRepository.findOne.mockResolvedValue(null);

      await expect(videoService.updateVideo(mockUser, 1, mockVideo)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('수정된 비디오 메타데이터를 반환한다.', async () => {
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      mockVideoRepository.findOne.mockResolvedValue(mockVideo);

      const updatedData = { ...mockVideo, ...mockUpdateVideoDto };
      mockVideoRepository.update.mockResolvedValue(undefined);
      mockVideoRepository.findOne.mockResolvedValue(mockUpdatedVideo);

      const result = await videoService.updateVideo(mockUser, 1, mockUpdateVideoDto);

      expect(channelRepository.findOne).toHaveBeenLastCalledWith({
        where: { userId: mockUser.id },
      });
      expect(videoRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(videoRepository.update).toHaveBeenCalledWith({ id: 1 }, mockUpdateVideoDto);
      expect(result).toEqual(updatedData);
    });
  });

  describe('영상 삭제 시', () => {
    it('유저가 소유한 채널이 아닐 시 UnauthorizedException을 반환해야 한다.', async () => {
      mockChannelRepository.findOne.mockResolvedValue(null);

      await expect(videoService.deleteVideo(mockUser, 1)).rejects.toThrow(UnauthorizedException);
    });

    it('해당 비디오가 존재 하지 않을 시 NotFoundException을 반환한다. ', async () => {
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
        where: { userId: mockUser.id },
      });
      expect(videoRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(videoRepository.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ message: '동영상이 삭제되었습니다.' });
    });
  });
});
