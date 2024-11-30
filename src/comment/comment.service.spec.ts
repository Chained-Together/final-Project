import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { CommentEntity } from './entities/comment.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommentDto } from './dto/comment.dto';
import { UserEntity } from '../user/entities/user.entity';

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

      mockCommentRepository.create.mockResolvedValue({
        userId: user.id,
        content: commentDto.content,
      });
      mockCommentRepository.save.mockResolvedValue({
        id: 1,
        userId: user.id,
        content: commentDto.content,
      });
      const result = await service.createComment(commentDto, user, videoId);
      expect(mockCommentRepository.create).toHaveBeenCalledWith({
        userId: user.id,
        content: commentDto.content,
        commentGroup: 1,
        depth: 0,
        orderNumber: 1,
        parentComment: 0,
        video: { id: videoId },
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

      mockVideoRepository.find.mockResolvedValue({ id: videoId });
      mockCommentRepository.findOne.mockResolvedValue({
        id: commentId,
      });

      const result = await service.findOne(videoId, commentId);

      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({
        where: { id: commentId },
      });

      expect(mockVideoRepository.find).toHaveBeenCalledWith({
        where: { id: videoId },
      });

      expect(result).toMatchObject([
        {
          id: commentId,
          userId: 1,
          content: 'content',
        },
      ]);
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

      mockCommentRepository.findOne.mockResolvedValue({ userId });
      mockCommentRepository.findOneBy.mockResolvedValue({ userId, commentId, videoId });
      mockCommentRepository.update.mockResolvedValue({ affected: 1 });
      mockCommentRepository.findOne.mockResolvedValue(updatedComment);

      const result = await service.updateComment(videoId, commentId.id, content, userId);
      expect(result).toEqual(updatedComment);

      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({
        where: { id: commentId.id },
      });
      expect(mockCommentRepository.update).toHaveBeenCalledWith(
        { id: commentId.id },
        { content: content.content },
      );
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

      mockCommentRepository.findOne.mockResolvedValue({ userId: user.id });

      mockCommentRepository.findOneBy.mockResolvedValue({
        userId: user.id,
        id: commentId,
        video: { id: videoId },
      });
      mockCommentRepository.delete.mockResolvedValue({
        affected: 1,
      });
      const result = await service.removeComment(videoId, commentId, user);
      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({
        where: { userId: user.id },
      });
      expect(mockCommentRepository.findOneBy).toHaveBeenCalledWith({
        userId: user.id,
        id: commentId,
        video: { id: videoId },
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
      mockCommentRepository.findOneBy.mockResolvedValue({
        id: commentId,
        userId: user.id,
        videoId,
      });
      mockCommentRepository.delete.mockResolvedValue({
        affected: 0,
      });
      await expect(service.removeComment(1, 1, user)).rejects.toThrow(BadRequestException);
    });
  });

  describe('답글 생성', () => {
    it('답글 생성 성공 검증', async () => {
      const videoId = 1;
      const commentId = 1;
      const user = { id: 1 } as UserEntity;
      const commentDto: CommentDto = { content: 'content' } as CommentDto;
      const commentGroup = 1;
      const depth = 1;
      const createdReply = {
        userId: user.id,
        content: commentDto.content,
        parentComment: commentId,
        depth: 1,
        orderNumber: 1,
        commentGroup: commentGroup,
        video: { id: videoId },
      };

      mockCommentRepository.findOneBy.mockResolvedValue({
        id: commentId,
        userId: user.id,
        video: { id: videoId },
      });
      mockCommentRepository.findOne
        .mockResolvedValueOnce({ id: commentId, commentGroup })
        .mockResolvedValueOnce({ orderNumber: 1 });
      mockCommentRepository.create.mockReturnValue(createdReply);
      mockCommentRepository.save.mockResolvedValue(createdReply);

      const result = await service.createReply(videoId, commentId, user, commentDto);

      expect(mockCommentRepository.findOneBy).toHaveBeenCalledWith({
        userId: user.id,
        id: commentId,
        video: { id: videoId },
      });
      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({
        where: { commentGroup, depth: 1 },
        order: { orderNumber: 'DESC' },
      });

      expect(mockCommentRepository.create).toHaveBeenCalledWith({
        userId: user.id,
        content: commentDto.content,
        parentComment: commentId,
        depth: 1,
        orderNumber: 2,
        commentGroup: commentGroup,
        video: { id: videoId },
      });
      expect(mockCommentRepository.save).toHaveBeenCalledWith(createdReply);
      expect(result).toEqual(createdReply);
    });
  });
});
