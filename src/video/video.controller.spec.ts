import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../user/entities/user.entity';
import { mockUser, mockVideo, mockVideos, videoDto } from './__mocks__/mock.video.data';
import { mockVideoService } from './__mocks__/mock.video.service';
import { UpdateVideoDto } from './dto/update.video.dto';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { Visibility } from './video.visibility.enum';

describe('VideoController', () => {
  let videoController: VideoController;

  beforeEach(async () => {
    jest.clearAllMocks();
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

  describe('saveMetadata', () => {
    it('비디오 메타데이터를 저장하고 리다이렉트 URL을 반환한다.', async () => {
      const redirectResponse = { redirectUrl: '/myChannel' };

      mockVideoService.saveMetadata.mockResolvedValueOnce(mockVideo);

      const result = await videoController.saveMetadata(mockUser, videoDto);

      expect(mockVideoService.saveMetadata).toHaveBeenCalledWith(mockUser, videoDto);
      expect(result).toEqual(redirectResponse);
    });
  });

  describe('getAllVideo', () => {
    it('모든 비디오를 반환한다.', async () => {
      mockVideoService.getAllVideo.mockResolvedValueOnce(mockVideos);

      const result = await videoController.getAllVideo();

      expect(mockVideoService.getAllVideo).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockVideos);
    });
  });

  describe('getVideo', () => {
    it('특정 ID의 비디오를 반환한다.', async () => {
      const mockAccessKey = 'test_access_key';
      const mockUser = { id: 1 } as UserEntity;

      mockVideoService.getVideo.mockResolvedValueOnce(mockVideo);

      const result = await videoController.getVideo(mockVideo.id, mockAccessKey, mockUser);

      expect(mockVideoService.getVideo).toHaveBeenCalledTimes(1);
      expect(mockVideoService.getVideo).toHaveBeenCalledWith(
        mockVideo.id,
        mockUser.id,
        mockAccessKey,
      );
      expect(result).toEqual(mockVideo);
    });

    it('인증되지 않은 상태에서 특정 ID의 비디오를 반환한다.', async () => {
      const mockAccessKey = 'test_access_key';
      const mockVideoId = mockVideo.id;

      mockVideoService.getVideo.mockResolvedValueOnce(mockVideo);

      const result = await videoController.getVideo(mockVideoId, mockAccessKey, undefined);

      expect(mockVideoService.getVideo).toHaveBeenCalledTimes(1);
      expect(mockVideoService.getVideo).toHaveBeenCalledWith(mockVideoId, undefined, mockAccessKey);
      expect(result).toEqual(mockVideo);
    });

    it('존재하지 않는 비디오를 요청하면 null을 반환한다.', async () => {
      const mockAccessKey = 'test_access_key';
      const mockUser = { id: 1 } as UserEntity;
      const nonExistentVideoId = 9999;

      mockVideoService.getVideo.mockResolvedValueOnce(null);

      const result = await videoController.getVideo(nonExistentVideoId, mockAccessKey, mockUser);

      expect(mockVideoService.getVideo).toHaveBeenCalledTimes(1);
      expect(mockVideoService.getVideo).toHaveBeenCalledWith(
        nonExistentVideoId,
        mockUser.id,
        mockAccessKey,
      );
      expect(result).toBeNull();
    });
  });

  describe('updateVideo', () => {
    it('비디오 정보를 업데이트하고 결과를 반환한다.', async () => {
      const updateDto: UpdateVideoDto = {
        title: 'Updated Title',
        description: 'Updated description',
        thumbnailUrl: 'https://example.com/updated-thumbnail.jpg',
        hashtags: ['#updated', '#video'],
        visibility: Visibility.PRIVATE,
      };

      const updatedVideo = { ...mockVideo, ...updateDto };
      mockVideoService.updateVideo.mockResolvedValueOnce(updatedVideo);

      const result = await videoController.updateVideo(mockUser, mockVideo.id, updateDto);

      expect(mockVideoService.updateVideo).toHaveBeenCalledWith(mockUser, mockVideo.id, updateDto);
      expect(result).toEqual(updatedVideo);
    });
  });

  describe('deleteVideo', () => {
    it('비디오를 삭제하고 메시지를 반환한다.', async () => {
      const mockResponse = { message: 'Video deleted successfully' };

      mockVideoService.deleteVideo.mockResolvedValueOnce(mockResponse);

      const result = await videoController.deleteVideo(mockUser, mockVideo.id);

      expect(mockVideoService.deleteVideo).toHaveBeenCalledWith(mockUser, mockVideo.id);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getVideoLink', () => {
    it('비디오 링크를 반환한다.', async () => {
      const videoLink = { link: 'https://example.com/video/1' };

      mockVideoService.getVideoLink.mockResolvedValueOnce(videoLink);

      const result = await videoController.getVideoLink(mockVideo.id);

      expect(mockVideoService.getVideoLink).toHaveBeenCalledWith(mockVideo.id);
      expect(result).toEqual(videoLink);
    });
  });

  describe('getNewVideos', () => {
    it('새로운 비디오 리스트를 반환한다.', async () => {
      const newVideos = [mockVideos[0]];
      const lastId = 10;
      const take = 6;

      mockVideoService.getNewVideos.mockResolvedValueOnce(newVideos);

      const result = await videoController.getNewVideos(lastId, take);

      expect(mockVideoService.getNewVideos).toHaveBeenCalledWith(lastId, take);
      expect(result).toEqual(newVideos);
    });
  });

  describe('getAllVideoOfMYChannel', () => {
    it('특정 채널 ID와 사용자 ID로 비디오 리스트를 반환한다.', async () => {
      const channelId = 1;
      const myChannelVideos = [mockVideos[0]];

      mockVideoService.getAllVideoOfMyChannel.mockResolvedValueOnce(myChannelVideos);

      const result = await videoController.getAllVideoOfMYChannel(channelId, mockUser);

      expect(mockVideoService.getAllVideoOfMyChannel).toHaveBeenCalledWith(channelId, mockUser.id);
      expect(result).toEqual(myChannelVideos);
    });
  });

  describe('getAllVideoOfChannel', () => {
    it('특정 채널 ID의 비디오 리스트를 반환한다.', async () => {
      const channelId = 1;

      mockVideoService.getAllVideoOfChannel.mockResolvedValueOnce(mockVideos);

      const result = await videoController.getAllVideoOfChannel(channelId);

      expect(mockVideoService.getAllVideoOfChannel).toHaveBeenCalledWith(channelId);
      expect(result).toEqual(mockVideos);
    });
  });

  describe('findVideoByKeyword', () => {
    it('검색된 비디오를 반환한다.', async () => {
      const mockKeyword = 'Video';

      mockVideoService.findVideoByKeyword.mockResolvedValueOnce(mockVideos);

      const result = await videoController.findVideoByKeyword(mockKeyword);

      expect(mockVideoService.findVideoByKeyword).toHaveBeenCalledWith(mockKeyword);
      expect(result).toEqual(mockVideos);
    });
  });
});
