import { Test, TestingModule } from '@nestjs/testing';
import { ResolutionService } from './resolution.service';
import { ResolutionEntity } from './entities/resolution.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateMetadataDto } from './dto/update-resolution.dto';
import { VideoEntity } from 'src/video/entities/video.entity';

describe('ResolutionService', () => {
  let resolutionService: ResolutionService;
  let resolutionRepository: Repository<ResolutionEntity>;
  let videoRepository: Repository<VideoEntity>;

  const mockResolutionRepository = {
    update: jest.fn(),
    findOne: jest.fn(),
  };

  const mockVideoRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockVideo = {
    id: 1,
  };

  const mockUpdateMetaDataDTO: UpdateMetadataDto = {
    highResolutionUrl: 'testHighResolutionURL',
    lowResolutionUrl: 'testLowResolutionURL',
    metadata: {
      videoCode: 'testVideoCode',
      duration: 10,
    },
  };

  const mockResolution = {
    id: 1,
    high: 'testHighResolutionURL',
    low: 'testLowResolutionURL',
    video: { id: 1 },
  };

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
    it('비디오를 찾을 수 없다면 NotFoundException 반환', async () => {
      mockVideoRepository.findOne.mockResolvedValue(null);

      await expect(
        resolutionService.updateResolution(
          mockUpdateMetaDataDTO.metadata.videoCode,
          mockUpdateMetaDataDTO.metadata.duration,
          mockUpdateMetaDataDTO.highResolutionUrl,
          mockUpdateMetaDataDTO.lowResolutionUrl,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('해당하는 비디오가 있다면 비디오의 길이랑 고화질, 저화질 URL을 업데이트 한다', async () => {
      mockVideoRepository.findOne.mockResolvedValue(mockVideo);

      mockResolutionRepository.update.mockResolvedValue({ affected: 1 });

      mockVideoRepository.update.mockResolvedValue({ affected: 1 });

      mockResolutionRepository.findOne.mockResolvedValue(mockResolution);

      const result = await resolutionService.updateResolution(
        mockUpdateMetaDataDTO.metadata.videoCode,
        mockUpdateMetaDataDTO.metadata.duration,
        mockUpdateMetaDataDTO.highResolutionUrl,
        mockUpdateMetaDataDTO.lowResolutionUrl,
      );

      expect(result).toEqual(mockResolution);
      expect(videoRepository.findOne).toHaveBeenCalledWith({
        where: { videoCode: mockUpdateMetaDataDTO.metadata.videoCode },
      });
      expect(resolutionRepository.update).toHaveBeenCalledWith(
        {
          video: { id: mockVideo.id },
        },
        {
          high: mockUpdateMetaDataDTO.highResolutionUrl,
          low: mockUpdateMetaDataDTO.lowResolutionUrl,
        },
      );
      expect(videoRepository.update).toHaveBeenCalledWith(
        { id: mockVideo.id },
        { duration: mockUpdateMetaDataDTO.metadata.duration },
      );
      expect(resolutionRepository.findOne).toHaveBeenCalledWith({
        where: { video: { id: mockResolution.video.id } },
      });
    });
  });
});
