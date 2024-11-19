import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { CommentEntity } from './entities/comment.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommentDto } from './dto/comment.dto';

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: Repository<CommentEntity>;
  let videoRepository: Repository<VideoEntity>;

  const mockCommentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockVideoRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: mockCommentRepository,
        },
        {
          provide: getRepositoryToken(VideoEntity),
          useValue: mockVideoRepository,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<Repository<CommentEntity>>(getRepositoryToken(CommentEntity));
    videoRepository = module.get<Repository<VideoEntity>>(getRepositoryToken(VideoEntity));
  });

  describe('댓글 생성', () => {
    it('댓글 생성 성공 검증', async () => {
      const commentDto: CommentDto = { content: 'test' };
      const user: UserEntity = { id: 1 } as UserEntity;
      const videoId = 1;

      mockCommentRepository.create.mockReturnValue({
        userId: user.id,
        content: commentDto.content,
      });
      mockCommentRepository.save.mockReturnValue({
        id: 1,
        userId: user.id,
        content: commentDto.content,
      });
      const result = await service.createComment(commentDto, user, videoId);
      expect(mockCommentRepository.create).toHaveBeenCalledWith({
        userId: user.id,
        content: commentDto.content,
      });
      expect(mockCommentRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        userId: user.id,
        content: commentDto.content,
      });
    });
  });

  describe('댓글 목록 조회', () => {
    it('댓글 목록 조회 성공 검증', async () => {
      const videoId = 1;
      const comments = [
        {
          id: 1,
          content: 'content',
          userId: 1,
          createdAt: new Date(),
        },
      ];

      mockVideoRepository.find.mockResolvedValue({
        where: { id: videoId },
      });
      mockCommentRepository.find.mockResolvedValue(comments);

      const result = await service.findAll(videoId);

      expect(mockCommentRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ data: comments });
    });

    it('댓글 목록 조회 실패 시 NotFoundException 출력 검증', async () => {
      mockVideoRepository.find.mockResolvedValue(null);

      await expect(service.findAll(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('댓글 상세 조회', () => {
    it('댓글 상세 조회 성공 검증', async () => {
      const videoId = 1;
      const commentId = 1;

      mockVideoRepository.find.mockReturnValue({ id: videoId });
      mockCommentRepository.findOne.mockReturnValue({
        id: commentId,
        userId: 1,
        content: 'test',
        createdAt: '2030-12-12',
      });
      const result = await service.findOne(videoId, commentId);
      expect(mockVideoRepository.find).toHaveBeenCalledWith({
        where: { id: videoId },
      });
      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({
        where: { id: commentId },
      });
      expect(result).toEqual({
        id: commentId,
        userId: 1,
        content: 'test',
        createdAt: '2030-12-12',
      });
    });
  });

  describe('댓글 수정 ', () => {
    it('댓글 수정 성공 검증', async () => {
      const videoId: number = 1;
      const userId: UserEntity = { id: 1 } as UserEntity;
      const commentId: CommentEntity = { id: 1 } as CommentEntity;
      const content: CommentDto = { content: 'content' } as CommentDto;
      const updatedComment = {
        id: 1,
        content: 'test',
        userId: 1,
        createdAt: '2030-12-12',
      };

      mockCommentRepository.findOneBy.mockResolvedValue({ userId, commentId });
      mockCommentRepository.update.mockResolvedValue({ commentId, content });

      const result = await service.updateComment(videoId, commentId.id, content, userId);
      expect(result).toEqual(updatedComment);
    });

    it('댓글 수정 실패 시 NotFoundException 출력 검증', async () => {
      const comment: CommentDto = { content: 'test' } as CommentDto;
      const user: UserEntity = { id: 1 } as UserEntity;

      mockCommentRepository.findOneBy.mockResolvedValue(null);

      await expect(service.updateComment(1, 1, comment, user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('댓글 삭제', () => {
    it('댓글 삭제 성공 검증', async () => {
      const videoId = 1;
      const commentId = 1;
      const user = { id: 1 } as UserEntity;
      mockCommentRepository.findOneBy.mockReturnValue({
        id: commentId,
        userId: user.id,
      });
      mockCommentRepository.delete.mockReturnValue({
        affected: 1,
      });
      const result = await service.removeComment(videoId, commentId, user);
      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({
        where: { id: commentId },
      });
      expect(mockCommentRepository.delete).toHaveBeenCalledWith({
        id: commentId,
      });
      expect(result).toEqual({
        success: true,
        message: '댓글이 성공적으로 삭제 되었습니다.',
      });
    });
    it('댓글 삭제 실패', async () => {
      const videoId = 1;
      const commentId = 1;
      const user = { id: 1 } as UserEntity;
      mockCommentRepository.findOneBy.mockReturnValue({
        id: commentId,
        userId: user.id,
      });
      mockCommentRepository.delete.mockReturnValue({
        affected: 0,
      });
      await expect(service.removeComment(1, 1, user)).rejects.toThrow(BadRequestException);
    });
  });
});
