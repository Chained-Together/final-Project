import { Test, TestingModule } from '@nestjs/testing';
import { ResolutionController } from './resolution.controller';
import { ResolutionService } from './resolution.service';
import { UpdateMetadataDto } from './dto/update-resolution.dto';
import { mockResolutionService } from './__mocks__/mock.resolution.service';
import { mockResolutionResponse, mockUpdateMetadataDto } from './__mocks__/mock.resolution.data';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ResolutionController', () => {
  let resolutionController: ResolutionController;
  let resolutionService: ResolutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResolutionController],
      providers: [
        {
          provide: ResolutionService,
          useValue: mockResolutionService,
        },
      ],
    }).compile();

    resolutionController = module.get<ResolutionController>(ResolutionController);
    resolutionService = module.get<ResolutionService>(ResolutionService);
  });

  describe('updateMetadata', () => {
    it('컨트롤러가 정의되어야 합니다.', () => {
      expect(resolutionController).toBeDefined();
    });

    it('성공적으로 메타데이터를 업데이트해야 합니다.', async () => {
      mockResolutionService.updateResolution.mockResolvedValue(mockResolutionResponse);

      const result = await resolutionController.updateMetadata(mockUpdateMetadataDto);

      expect(resolutionService.updateResolution).toHaveBeenCalledWith(
        mockUpdateMetadataDto.metadata.videoCode,
        mockUpdateMetadataDto.metadata.duration,
        mockUpdateMetadataDto.highResolutionUrl,
        mockUpdateMetadataDto.lowResolutionUrl,
      );
      expect(result).toEqual(mockResolutionResponse);
    });
    it('서비스에서 오류가 발생하면 HttpException을 던져야 합니다.', async () => {
      mockResolutionService.updateResolution.mockRejectedValue(
        new Error('Failed to process metadata'),
      );

      await expect(resolutionController.updateMetadata(mockUpdateMetadataDto)).rejects.toThrow(
        new HttpException('Failed to process metadata', HttpStatus.INTERNAL_SERVER_ERROR),
      );

      expect(resolutionService.updateResolution).toHaveBeenCalledWith(
        mockUpdateMetadataDto.metadata.videoCode,
        mockUpdateMetadataDto.metadata.duration,
        mockUpdateMetadataDto.highResolutionUrl,
        mockUpdateMetadataDto.lowResolutionUrl,
      );
    });
  });
});
