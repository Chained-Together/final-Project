import { Test, TestingModule } from '@nestjs/testing';
import { ResolutionController } from './resolution.controller';
import { ResolutionService } from './resolution.service';
import { UpdateMetadataDto } from './dto/update-resolution.dto';

describe('ResolutionController', () => {
  let resolutionController: ResolutionController;
  let resolutionService: ResolutionService;

  const mockResolutionService = {
    updateResolution: jest.fn(),
  };

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

    it('동영상에 해당하는 고화질 URL과 저화질 URL을 추가해야한다.', async () => {
      const mockUpdateMetaDataDTO: UpdateMetadataDto = {
        highResolutionUrl: 'testHighResolutionURL',
        lowResolutionUrl: 'testLowResolutionURL',
        metadata: {
          videoCode: 'testVideoCode',
          duration: 10,
        },
      };
      const mockResolution = 'mockResolution';

      mockResolutionService.updateResolution.mockResolvedValue(mockResolution);

      const result = await resolutionController.updateMetadata(mockUpdateMetaDataDTO);

      expect(resolutionService.updateResolution).toHaveBeenCalledWith(
        mockUpdateMetaDataDTO.metadata.videoCode,
        mockUpdateMetaDataDTO.metadata.duration,
        mockUpdateMetaDataDTO.highResolutionUrl,
        mockUpdateMetaDataDTO.lowResolutionUrl,
      );
      expect(result).toEqual(mockResolution);
    });
  });
});
