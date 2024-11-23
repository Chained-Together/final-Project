import { Test, TestingModule } from '@nestjs/testing';
import { ResolutionController } from './resolution.controller';
import { ResolutionService } from './resolution.service';

describe('ResolutionController', () => {
  let controller: ResolutionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResolutionController],
      providers: [ResolutionService],
    }).compile();

    controller = module.get<ResolutionController>(ResolutionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
