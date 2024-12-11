import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IResolutionRepository } from 'src/interface/resolution-interface';
import { IVideoRepository } from 'src/interface/video-interface';
import { mockResolution } from '../video/__mocks__/mock.video.data';
import { mockUpdateMetadataDto, mockVideo } from './__mocks__/mock.resolution.data';
import { mockResolutionRepository, mockVideoRepository } from './__mocks__/mock.resolution.service';
import { ResolutionService } from './resolution.service';

describe('ResolutionService', () => {
  let resolutionService: ResolutionService;
  let resolutionRepository: IResolutionRepository;
  let videoRepository: IVideoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResolutionService,
        {
          provide: 'IResolutionRepository',
          useValue: mockResolutionRepository,
        },
        {
          provide: 'IVideoRepository',
          useValue: mockVideoRepository,
        },
      ],
    }).compile();

    resolutionService = module.get<ResolutionService>(ResolutionService);
    resolutionRepository = module.get<IResolutionRepository>('IResolutionRepository');
    videoRepository = module.get<IVideoRepository>('IVideoRepository');
  });

  describe('updateResolution', () => {
    it('비디오를 찾을 수 없으면 NotFoundException을 던져야 한다.', async () => {
      mockVideoRepository.findVideoByVideoCode.mockResolvedValue(null);

      await expect(
        resolutionService.updateResolution(
          mockUpdateMetadataDto.metadata.videoCode,
          mockUpdateMetadataDto.metadata.duration,
          mockUpdateMetadataDto.highResolutionUrl,
          mockUpdateMetadataDto.lowResolutionUrl,
        ),
      ).rejects.toThrow(NotFoundException);

      expect(videoRepository.findVideoByVideoCode).toHaveBeenCalledWith(
        mockUpdateMetadataDto.metadata.videoCode,
      );
      expect(resolutionRepository.updateResolution).not.toHaveBeenCalled();
      expect(videoRepository.updateVideo).not.toHaveBeenCalled();
    });

    it('해상도 업데이트가 실패하면 예외를 던져야 한다.', async () => {
      mockVideoRepository.findVideoByVideoCode.mockResolvedValue(mockVideo);
      mockResolutionRepository.updateResolution.mockResolvedValue({ affected: 0 });
      await expect(
        resolutionService.updateResolution(
          mockUpdateMetadataDto.metadata.videoCode,
          mockUpdateMetadataDto.metadata.duration,
          mockUpdateMetadataDto.highResolutionUrl,
          mockUpdateMetadataDto.lowResolutionUrl,
        ),
      ).rejects.toThrow('해상도 정보를 업데이트할 수 없습니다.');

      expect(videoRepository.findVideoByVideoCode).toHaveBeenCalledWith(
        mockUpdateMetadataDto.metadata.videoCode,
      );
      expect(resolutionRepository.updateResolution).toHaveBeenCalledWith(
        mockVideo.id,
        mockUpdateMetadataDto.highResolutionUrl,
        mockUpdateMetadataDto.lowResolutionUrl,
      );
      expect(videoRepository.updateVideo).not.toHaveBeenCalled();
    });

    it('비디오 메타데이터 업데이트가 실패하면 예외를 던져야 한다.', async () => {
      mockVideoRepository.findVideoByVideoCode.mockResolvedValue(mockVideo);
      mockResolutionRepository.updateResolution.mockResolvedValue({ affected: 1 });
      mockVideoRepository.updateVideo.mockResolvedValue({ affected: 0 });

      await expect(
        resolutionService.updateResolution(
          mockUpdateMetadataDto.metadata.videoCode,
          mockUpdateMetadataDto.metadata.duration,
          mockUpdateMetadataDto.highResolutionUrl,
          mockUpdateMetadataDto.lowResolutionUrl,
        ),
      ).rejects.toThrow('비디오 메타데이터를 업데이트할 수 없습니다.');

      expect(videoRepository.findVideoByVideoCode).toHaveBeenCalledWith(
        mockUpdateMetadataDto.metadata.videoCode,
      );
      expect(resolutionRepository.updateResolution).toHaveBeenCalledWith(
        mockVideo.id,
        mockUpdateMetadataDto.highResolutionUrl,
        mockUpdateMetadataDto.lowResolutionUrl,
      );
      expect(videoRepository.updateVideo).toHaveBeenCalledWith(mockVideo.id, {
        duration: mockUpdateMetadataDto.metadata.duration,
        status: true,
      });
    });

    it('해상도와 비디오 메타데이터 업데이트가 성공하면 업데이트된 데이터를 반환해야 한다.', async () => {
      mockVideoRepository.findVideoByVideoCode.mockResolvedValue(mockVideo);
      mockResolutionRepository.updateResolution.mockResolvedValue({ affected: 1 });
      mockVideoRepository.updateVideo.mockResolvedValue({ affected: 1 });
      mockResolutionRepository.findResolutionByvideoId.mockResolvedValue(mockResolution);

      const result = await resolutionService.updateResolution(
        mockUpdateMetadataDto.metadata.videoCode,
        mockUpdateMetadataDto.metadata.duration,
        mockUpdateMetadataDto.highResolutionUrl,
        mockUpdateMetadataDto.lowResolutionUrl,
      );

      expect(result).toEqual(mockResolution);
      expect(videoRepository.findVideoByVideoCode).toHaveBeenCalledWith(
        mockUpdateMetadataDto.metadata.videoCode,
      );
      expect(resolutionRepository.updateResolution).toHaveBeenCalledWith(
        mockVideo.id,
        mockUpdateMetadataDto.highResolutionUrl,
        mockUpdateMetadataDto.lowResolutionUrl,
      );
      expect(videoRepository.updateVideo).toHaveBeenCalledWith(mockVideo.id, {
        duration: mockUpdateMetadataDto.metadata.duration,
        status: true,
      });
      expect(resolutionRepository.findResolutionByvideoId).toHaveBeenCalledWith(mockVideo.id);
    });
  });
});
