import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationService } from 'src/notification/notification.service';
import { CommentEntity } from './entities/comment.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { mockCommentRepository, mockVideoRepository } from './__mocks__/mock.comment.service';
import {
  mockCommentDto,
  mockUser,
  mockComment,
  mockCommentList,
  mockReplyComment,
  mockUpdatedCommentDto,
  mockUpdatedComment,
  mockCommentDeletionResponse,
} from './__mocks__/mock.commnet.data';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: Repository<CommentEntity>;
  let videoRepository: Repository<VideoEntity>;
  let notificationService: NotificationService;

  const mockNotificationService = {
    emitNotification: jest.fn(),
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
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<Repository<CommentEntity>>(getRepositoryToken(CommentEntity));
    videoRepository = module.get<Repository<VideoEntity>>(getRepositoryToken(VideoEntity));
    notificationService = module.get<NotificationService>(NotificationService);
  });

  describe('createComment', () => {
    it('댓글 생성 성공 검증', async () => {
      mockCommentRepository.findOne.mockResolvedValue(null);
      mockCommentRepository.create.mockReturnValue(mockComment);
      mockCommentRepository.save.mockResolvedValue(mockComment);

      const result = await service.createComment(mockCommentDto, mockUser, mockComment.videoId);

      expect(mockCommentRepository.findOne).toHaveBeenCalled();
      expect(mockCommentRepository.create).toHaveBeenCalledWith({
        userId: mockUser.id,
        content: mockCommentDto.content,
        parentComment: 0,
        depth: 0,
        orderNumber: 1,
        commentGroup: 1,
        video: { id: mockComment.videoId },
      });
      expect(mockCommentRepository.save).toHaveBeenCalledWith(mockComment);
      expect(notificationService.emitNotification).toHaveBeenCalledWith(
        `${mockUser.id}님이 ${mockComment.videoId} 영상에 댓글을 달았습니다.`,
        mockComment.videoId,
      );
      expect(result).toEqual(mockComment);
    });
  });

  describe('findAll', () => {
    it('댓글 목록 조회 성공 검증', async () => {
      mockVideoRepository.find.mockResolvedValue({ id: mockComment.videoId });
      mockCommentRepository.find.mockResolvedValue(mockCommentList);

      const result = await service.findAll(mockComment.videoId);

      expect(mockCommentRepository.find).toHaveBeenCalledWith({
        where: { video: { id: mockComment.videoId }, depth: 0 },
        select: ['id', 'userId', 'content', 'createdAt'],
        order: { createdAt: 'ASC' },
      });
      expect(result).toEqual({ data: mockCommentList });
    });

    it('존재하지 않는 비디오 ID로 조회 시 NotFoundException 발생 검증', async () => {
      mockVideoRepository.find.mockResolvedValue(null);

      await expect(service.findAll(mockComment.videoId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateComment', () => {
    it('댓글 수정 성공 검증', async () => {
      mockCommentRepository.findOneBy.mockResolvedValue(mockComment);
      mockCommentRepository.update.mockResolvedValue({ affected: 1 });
      mockCommentRepository.findOne.mockResolvedValue(mockUpdatedComment);
    
      const result = await service.updateComment(
        mockComment.videoId,
        mockComment.id,
        mockUpdatedCommentDto,
        mockUser,
      );
    
      expect(result).toEqual(mockUpdatedComment);
      expect(mockCommentRepository.update).toHaveBeenCalledWith(
        { id: mockComment.id },
        { content: mockUpdatedCommentDto.content },
      );
    });

    it('존재하지 않는 댓글 수정 시 NotFoundException 발생 검증', async () => {
      mockCommentRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.updateComment(mockComment.videoId, mockComment.id, mockUpdatedCommentDto, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeComment', () => {
    it('댓글 삭제 성공 검증', async () => {
      mockCommentRepository.findOneBy.mockResolvedValue(mockComment);
      mockCommentRepository.delete.mockResolvedValue({ affected: 1 });
    
      const result = await service.removeComment(mockComment.videoId, mockComment.id, mockUser);
    
      expect(mockCommentRepository.delete).toHaveBeenCalledWith({ id: mockComment.id });
      expect(result).toEqual(mockCommentDeletionResponse);
    });
    
    it('존재하지 않는 댓글 삭제 시 BadRequestException 발생 검증', async () => {
      mockCommentRepository.findOneBy.mockResolvedValue(mockComment);
      mockCommentRepository.delete.mockResolvedValue({ affected: 0 });
    
      await expect(
        service.removeComment(mockComment.videoId, mockComment.id, mockUser),
      ).rejects.toThrow(BadRequestException);
    });

  describe('createReply', () => {
    it('답글 생성 성공 검증', async () => {
      mockCommentRepository.findOneBy.mockResolvedValue(mockComment);
      mockCommentRepository.findOne.mockResolvedValue(mockComment); 
      mockCommentRepository.create.mockReturnValue(mockReplyComment);
      mockCommentRepository.save.mockResolvedValue(mockReplyComment);
    
      const result = await service.createReply(mockComment.videoId, mockComment.id, mockUser, mockCommentDto);
    
      expect(mockCommentRepository.create).toHaveBeenCalledWith({
        userId: mockUser.id,
        content: mockCommentDto.content,
        parentComment: mockComment.id,
        depth: 1,
        orderNumber: 2,
        commentGroup: mockComment.commentGroup,
        video: { id: mockComment.videoId },
      });
      expect(mockCommentRepository.save).toHaveBeenCalledWith(mockReplyComment);
      expect(notificationService.emitNotification).toHaveBeenCalledWith(
        `${mockUser.id}님이 ${mockComment.videoId} 영상에 댓글을 달았습니다.`,
        mockComment.videoId,
      );
      expect(result).toEqual(mockReplyComment);
    });
  });
});
})
