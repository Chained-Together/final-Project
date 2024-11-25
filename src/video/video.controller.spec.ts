import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { VideoEntity } from './entities/video.entity';
import { VideoDto } from './dto/video.dto';
import { UpdateVideoDto } from './dto/update.video.dto';
import { Visibility } from './video.visibility.enum';

const mockVideoService = {
  saveMetadata: jest.fn(),
  getAllVideo: jest.fn(),
  getVideo: jest.fn(),
  updateVideo: jest.fn(),
  deleteVideo: jest.fn(),
};

describe('VideoController', () => {
  let videoController: VideoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useValue: mockVideoService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    videoController = module.get<VideoController>(VideoController);
  });

  describe('createVideo', () => {
    it('비디오를 메타 데이터를 저장하고 키를 반환한다.', async () => {
      const mockUser = { id: 1 } as any;
      const videoDto: VideoDto = {
        title: 'Test Video',
        description: 'This is a test description',
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        hashtags: ['#test', '#video'],
        high: 'url',
        low: 'url',
        duration: 300,
        visibility: Visibility.PUBLIC,
        videoCode: '1',
      };

      const mockVideo: VideoEntity = {
        id: 1,
        title: 'test',
        description: 'test',
        thumbnailUrl: 'test',
        hashtags: ['공포', '고양이'],
        visibility: Visibility.PUBLIC,
        duration: 10,
        views: 0,
        uploadedAt: new Date(),
        updatedAt: null,
        resolution: null,
        channel: null,
        likes: null,
        videoCode: '1',
        status: false,
        comments: null,
      };

      jest
        .spyOn(mockVideoService, 'saveMetadata')
        .mockResolvedValueOnce({ key: mockVideo.videoCode });

      const result = await videoController.saveMetadata(mockUser, videoDto);

      expect(mockVideoService.saveMetadata).toHaveBeenCalledWith(mockUser, videoDto);
      expect(result).toEqual({ key: mockVideo.videoCode });
    });
  });

  describe('updateVideo', () => {
    it('선택적으로 업데이트된 비디오를 반환한다', async () => {
      const mockUser = { id: 1 } as any;
      const updateDto: UpdateVideoDto = {
        title: 'Updated Title',
        description: 'Updated description',
        thumbnailUrl: 'https://example.com/updated-thumbnail.jpg',
        hashtags: ['#updated', '#video'],
        visibility: Visibility.PRIVATE,
      };
      const mockUpdatedVideo = { id: 1, ...updateDto } as VideoEntity;

      jest.spyOn(mockVideoService, 'updateVideo').mockResolvedValueOnce(mockUpdatedVideo);

      const result = await videoController.updateVideo(mockUser, 1, updateDto);

      expect(mockVideoService.updateVideo).toHaveBeenCalledWith(mockUser, 1, updateDto);
      expect(result).toEqual(mockUpdatedVideo);
    });

    it('필드 일부만 업데이트하고 반환한다', async () => {
      const mockUser = { id: 1 } as any;
      const updateDto: UpdateVideoDto = {
        title: 'Partially Updated Title',
      } as UpdateVideoDto;
      const mockPartiallyUpdatedVideo = {
        id: 1,
        title: 'Partially Updated Title',
        description: 'Original description',
        thumbnailUrl: 'https://example.com/original-thumbnail.jpg',
        hashtags: ['#original'],
        visibility: Visibility.PUBLIC,
      } as VideoEntity;

      jest.spyOn(mockVideoService, 'updateVideo').mockResolvedValueOnce(mockPartiallyUpdatedVideo);

      const result = await videoController.updateVideo(mockUser, 1, updateDto);

      expect(mockVideoService.updateVideo).toHaveBeenCalledWith(mockUser, 1, updateDto);
      expect(result).toEqual(mockPartiallyUpdatedVideo);
    });
  });

  describe('getAllVideo', () => {
    it('모든 비디오를 반환한다', async () => {
      const mockVideos: VideoEntity[] = [
        { id: 1, title: 'Video 1', visibility: Visibility.PUBLIC } as VideoEntity,
        { id: 2, title: 'Video 2', visibility: Visibility.PRIVATE } as VideoEntity,
      ];

      jest.spyOn(mockVideoService, 'getAllVideo').mockResolvedValueOnce(mockVideos);

      const result = await videoController.getAllVideo();

      expect(mockVideoService.getAllVideo).toHaveBeenCalled();
      expect(result).toEqual(mockVideos);
    });
  });

  describe('getVideo', () => {
    it('특정 ID의 비디오를 반환한다', async () => {
      const mockVideo = {
        id: 1,
        title: 'Test Video',
        visibility: Visibility.PUBLIC,
      } as VideoEntity;

      jest.spyOn(mockVideoService, 'getVideo').mockResolvedValueOnce(mockVideo);

      const result = await videoController.getVideo(1);

      expect(mockVideoService.getVideo).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockVideo);
    });
  });

  describe('deleteVideo', () => {
    it('특정 비디오를 삭제하고 메시지를 반환한다', async () => {
      const mockUser = { id: 1 } as any;
      const mockResponse = { message: 'Video deleted successfully' };

      jest.spyOn(mockVideoService, 'deleteVideo').mockResolvedValueOnce(mockResponse);

      const result = await videoController.deleteVideo(mockUser, 1);

      expect(mockVideoService.deleteVideo).toHaveBeenCalledWith(mockUser, 1);
      expect(result).toEqual(mockResponse);
    });
  });
});
