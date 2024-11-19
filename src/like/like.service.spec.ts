import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from './like.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LikeEntity } from './entities/like.entity';
import { Repository } from 'typeorm';

describe('LikeService', () => {
  let likeService: LikeService;
  let likeRepository: Repository<LikeEntity>;

  const mockLikeRepository = {
    findOne: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
  };

  const mockLike = { id: 1, user: { id: 1 }, video: { id: 123 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        {
          provide: getRepositoryToken(LikeEntity),
          useValue: {
            ...mockLikeRepository,
            // findOne: jest.fn(),
            // delete: jest.fn(),
            // save: jest.fn(),
          },
        },
      ],
    }).compile();

    likeService = module.get<LikeService>(LikeService);
    likeRepository = module.get<Repository<LikeEntity>>(getRepositoryToken(LikeEntity));
  });

  describe('toggleLike', () => {
    it('이미 좋아요 기록이 있다면 좋아요를 삭제한다', async () => {
      mockLikeRepository.findOne.mockResolvedValue(mockLike);
      mockLikeRepository.delete.mockResolvedValue({ affected: 1 });
      // jest.spyOn(likeRepository, 'findOne').mockResolvedValue(mockLike as LikeEntity);
      // jest.spyOn(likeRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      const result = await likeService.toggleLike(123, 1);

      expect(likeRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: 1 } ,video: { id: 123 }},
      });
      expect(likeRepository.delete).toHaveBeenCalledWith({
        user: { id: 1 },
        video: { id: 123 },
      });
      expect(result).toEqual({ affected: 1 });
    });

    it('좋아요 기록이 없다면 좋아요를 저장한다.', async () => {
      mockLikeRepository.findOne.mockResolvedValue(null);
      mockLikeRepository.save.mockResolvedValue(mockLike);
      // jest.spyOn(likeRepository, 'findOne').mockResolvedValue(null);
      // jest.spyOn(likeRepository, 'save').mockResolvedValue(mockLike as LikeEntity);

      const result = await likeService.toggleLike(123, 1);

      expect(likeRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: { id: 1 },
          video: { id: 123 },
        },
      });
      expect(likeRepository.save).toHaveBeenCalledWith({
        user: { id: 1 },
        video: { id: 123 },
      });

      expect(result).toEqual(mockLike);
    });
  });
});
