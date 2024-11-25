import { Test, TestingModule } from '@nestjs/testing';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

describe('LikeController', () => {
  let controller: LikeController;
  let service: LikeService;

  const mockLikeService = {
    toggleLike: jest.fn(),
    getLikes: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      req.user = { id: 1, email: 'test@example.com' };
      return true;
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikeController],
      providers: [{ provide: LikeService, useValue: mockLikeService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<LikeController>(LikeController);
    service = module.get<LikeService>(LikeService);
  });

  it('컨트롤러가 정의되어야 합니다.', () => {
    expect(controller).toBeDefined();
  });

  it('좋아요를 추가하거나 삭제해야 한다', async () => {
    const videoId = 123;
    const mockResponse = { video: { id: videoId }, user: { id: 1 } };

    mockLikeService.toggleLike.mockResolvedValue(mockResponse);

    const result = await controller.toggleLike(videoId, { user: { id: 1 } } as any);

    expect(service.toggleLike).toHaveBeenCalledWith(1, videoId);
    expect(result).toEqual(mockResponse);
  });

  it('좋아요 삭제를 반환해야 한다', async () => {
    const videoId = 123;
    const mockDeleteResult: { affected: number } = { affected: 1 };

    mockLikeService.toggleLike.mockResolvedValue(mockDeleteResult);

    const result = await controller.toggleLike(videoId, { user: { id: 1 } } as any);

    expect(service.toggleLike).toHaveBeenCalledWith(1, videoId);
    expect(result).toEqual(mockDeleteResult);
  });

  it('좋아요 기능 중 에러 발생 시 예외를 던져야 한다', async () => {
    const videoId = 123;

    mockLikeService.toggleLike.mockRejectedValue(new Error('테스트 에러'));

    await expect(controller.toggleLike(videoId, { user: { id: 1 } } as any)).rejects.toThrow(
      '테스트 에러',
    );

    expect(service.toggleLike).toHaveBeenCalledWith(1, videoId);
  });

  it('좋아요 총갯수를 가져와야 한다', async () => {
    const videoId = 123;

    mockLikeService.getLikes.mockResolvedValue(videoId);

    const result = await controller.getLikes(videoId);

    expect(service.getLikes).toHaveBeenCalledWith(videoId);
    expect(result).toEqual(videoId);
  });
});
