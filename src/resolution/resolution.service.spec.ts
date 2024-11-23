import { Test, TestingModule } from '@nestjs/testing';
import { ResolutionService } from './resolution.service';

describe('ResolutionService', () => {
  let service: ResolutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResolutionService],
    }).compile();

    service = module.get<ResolutionService>(ResolutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
