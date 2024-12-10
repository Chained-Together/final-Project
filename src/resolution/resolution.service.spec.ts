import { Test, TestingModule } from '@nestjs/testing';
import { ResolutionService } from './resolution.service';
import { ResolutionEntity } from './entities/resolution.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VideoEntity } from 'src/video/entities/video.entity';
import { mockResolutionRepository, mockVideoRepository } from './__mocks__/mock.resolution.service';
import { mockUpdateMetadataDto, mockVideo } from './__mocks__/mock.resolution.data';
import { NotFoundException } from '@nestjs/common';
import { mockResolution } from '../video/__mocks__/mock.video.data';

describe('ResolutionService', () => {
  let resolutionService: ResolutionService;
  let resolutionRepository: Repository<ResolutionEntity>;
  let videoRepository: Repository<VideoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResolutionService,
        {
          provide: getRepositoryToken(ResolutionEntity),
          useValue: mockResolutionRepository,
        },
        {
          provide: getRepositoryToken(VideoEntity),
          useValue: mockVideoRepository,
        },
      ],
    }).compile();

    resolutionService = module.get<ResolutionService>(ResolutionService);
    resolutionRepository = module.get<Repository<ResolutionEntity>>(
      getRepositoryToken(ResolutionEntity),
    );
    videoRepository = module.get<Repository<VideoEntity>>(getRepositoryToken(VideoEntity));
  });

  describe('updateResolution', () => {
    it('비디오를 찾을 수 없으면 NotFoundException을 던져야 한다.', async () => {
      mockVideoRepository.findOne.mockResolvedValue(null);

      await expect(
        resolutionService.updateResolution(
          mockUpdateMetadataDto.metadata.videoCode,
          mockUpdateMetadataDto.metadata.duration,
          mockUpdateMetadataDto.metadata.thumbnail,
          mockUpdateMetadataDto.videoUrl,
        ),
      ).rejects.toThrow(NotFoundException);

      expect(videoRepository.findOne).toHaveBeenCalledWith({
        where: { videoCode: mockUpdateMetadataDto.metadata.videoCode },
      });
      expect(resolutionRepository.update).not.toHaveBeenCalled();
      expect(videoRepository.update).not.toHaveBeenCalled();
    });

    it('해상도 업데이트가 실패하면 예외를 던져야 한다.', async () => {
      mockVideoRepository.findOne.mockResolvedValue(mockVideo);
      mockResolutionRepository.update.mockResolvedValue({ affected: 0 }); // 실패 시뮬레이션

      await expect(
        resolutionService.updateResolution(
          mockUpdateMetadataDto.metadata.videoCode,
          mockUpdateMetadataDto.metadata.duration,
          mockUpdateMetadataDto.metadata.thumbnail,
          mockUpdateMetadataDto.videoUrl,
        ),
      ).rejects.toThrow('해상도 정보를 업데이트할 수 없습니다.');

      expect(videoRepository.findOne).toHaveBeenCalledWith({
        where: { videoCode: mockUpdateMetadataDto.metadata.videoCode },
      });
      expect(resolutionRepository.update).toHaveBeenCalledWith(
        { video: { id: mockVideo.id } },
        {
          videoUrl: mockUpdateMetadataDto.videoUrl,
        },
      );
      expect(videoRepository.update).not.toHaveBeenCalled();
    });

    it('비디오 메타데이터 업데이트가 실패하면 예외를 던져야 한다.', async () => {
      mockVideoRepository.findOne.mockResolvedValue(mockVideo);
      mockResolutionRepository.update.mockResolvedValue({ affected: 1 }); // 성공 시뮬레이션
      mockVideoRepository.update.mockResolvedValue({ affected: 0 }); // 실패 시뮬레이션

      await expect(
        resolutionService.updateResolution(
          mockUpdateMetadataDto.metadata.videoCode,
          mockUpdateMetadataDto.metadata.duration,
          mockUpdateMetadataDto.metadata.thumbnail,
          mockUpdateMetadataDto.videoUrl,
        ),
      ).rejects.toThrow('비디오 메타데이터를 업데이트할 수 없습니다.');

      expect(videoRepository.findOne).toHaveBeenCalledWith({
        where: { videoCode: mockUpdateMetadataDto.metadata.videoCode },
      });
      expect(resolutionRepository.update).toHaveBeenCalledWith(
        { video: { id: mockVideo.id } },
        {
          videoUrl: mockUpdateMetadataDto.videoUrl,
        },
      );
      expect(videoRepository.update).toHaveBeenCalledWith(
        { id: mockVideo.id },
        {
          duration: mockUpdateMetadataDto.metadata.duration,
          status: true,
          thumbnail: mockUpdateMetadataDto.metadata.thumbnail,
        },
      );
    });

    it('해상도와 비디오 메타데이터 업데이트가 성공하면 업데이트된 데이터를 반환해야 한다.', async () => {
      mockVideoRepository.findOne.mockResolvedValue(mockVideo);
      mockResolutionRepository.update.mockResolvedValue({ affected: 1 });
      mockVideoRepository.update.mockResolvedValue({ affected: 1 });
      mockResolutionRepository.findOne.mockResolvedValue(mockResolution);

      const result = await resolutionService.updateResolution(
        mockUpdateMetadataDto.metadata.videoCode,
        mockUpdateMetadataDto.metadata.duration,
        mockUpdateMetadataDto.metadata.thumbnail,
        mockUpdateMetadataDto.videoUrl,
      );

      expect(result).toEqual(mockResolution);
      expect(videoRepository.findOne).toHaveBeenCalledWith({
        where: { videoCode: mockUpdateMetadataDto.metadata.videoCode },
      });
      expect(resolutionRepository.update).toHaveBeenCalledWith(
        { video: { id: mockVideo.id } },
        {
          videoUrl: mockUpdateMetadataDto.videoUrl,
        },
      );
      expect(videoRepository.update).toHaveBeenCalledWith(
        { id: mockVideo.id },
        {
          duration: mockUpdateMetadataDto.metadata.duration,
          status: true,
          thumbnail: mockUpdateMetadataDto.metadata.thumbnail,
        },
      );
      expect(resolutionRepository.findOne).toHaveBeenCalledWith({
        where: { video: { id: mockVideo.id } },
      });
    });
  });
});
