import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockVideo } from 'src/channel/_mocks_/mock.channel.data';
import { ICommentRepository } from 'src/interface/comment-interface';
import { IVideoRepository } from 'src/interface/video-interface';
import { NotificationService } from 'src/notification/notification.service';
import {
  mockCommentRepository,
  mockNotificationService,
  mockVideoRepository,
} from './__mocks__/mock.comment.service';
import {
  mockComment,
  mockCommentDeletionResponse,
  mockCommentDto,
  mockCommentList,
  mockReplyComment,
  mockUpdatedComment,
  mockUpdatedCommentDto,
  mockUser,
} from './__mocks__/mock.commnet.data';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;
  let videoRepository: IVideoRepository;
  let notificationService: NotificationService;
  let commentRepository: ICommentRepository;

  const mockNotificationService = {
    emitNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: 'ICommentRepository',
          useValue: mockCommentRepository,
        },
        {
          provide: 'IVideoRepository',
          useValue: mockVideoRepository,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<ICommentRepository>('ICommentRepository');
    videoRepository = module.get<IVideoRepository>('IVideoRepository');
    notificationService = module.get<NotificationService>(NotificationService);
  });

  describe('createComment', () => {
    it('댓글 생성 성공 검증', async () => {
      mockCommentRepository.findCommentByVideoIdAndDepth.mockResolvedValue(null);
      mockCommentRepository.createComment.mockReturnValue(mockComment);
      mockCommentRepository.save.mockResolvedValue(mockComment);

      const result = await service.createComment(mockCommentDto, mockUser, mockComment.videoId);

      expect(mockCommentRepository.findCommentByVideoIdAndDepth).toHaveBeenCalled();
      expect(mockCommentRepository.createComment).toHaveBeenCalledWith(
        mockUser.id,
        mockCommentDto.content,
        1,
        mockComment.videoId,
      );
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
      mockVideoRepository.findVideoByVideoId.mockResolvedValue({ id: mockComment.videoId });
      mockCommentRepository.findAllComment.mockResolvedValue(mockCommentList);

      const result = await service.findAll(mockComment.videoId);

      expect(mockCommentRepository.findAllComment).toHaveBeenCalledWith(mockComment.videoId);
      expect(result).toEqual({ data: mockCommentList });
    });

    it('존재하지 않는 비디오 ID로 조회 시 NotFoundException 발생 검증', async () => {
      mockVideoRepository.findVideoByVideoId.mockResolvedValue(null);

      await expect(service.findAll(mockComment.videoId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('비디오가 존재하지 않을 경우 NotFoundException 발생 검증', async () => {
      mockVideoRepository.findVideoByVideoId.mockResolvedValue(null);

      await expect(service.findOne(mockComment.videoId, mockComment.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('댓글이 존재하지 않을 경우 NotFoundException 발생 검증', async () => {
      mockVideoRepository.findVideoByVideoId.mockResolvedValue(mockVideo);
      mockCommentRepository.findCommentByCommentId.mockResolvedValue(null);

      await expect(service.findOne(mockComment.videoId, mockComment.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('댓글 상세 조회 성공 검증', async () => {
      mockVideoRepository.findVideoByVideoId.mockResolvedValue({ id: mockComment.videoId });
      mockCommentRepository.findCommentByCommentId.mockResolvedValue({ id: mockComment.id });
      mockCommentRepository.findAllReplyComment.mockResolvedValue(mockReplyComment);

      const result = await service.findOne(mockComment.videoId, mockComment.id);

      expect(mockVideoRepository.findVideoByVideoId).toHaveBeenCalledWith(mockComment.videoId);
      expect(mockCommentRepository.findCommentByCommentId).toHaveBeenCalledWith(mockComment.id);
      expect(mockCommentRepository.findAllReplyComment).toHaveBeenCalledWith(mockComment.id);
      expect(result).toEqual(mockReplyComment);
    });
  });

  describe('updateComment', () => {
    it('유저가 존재하지 않으면 NotFoundException을 던집니다', async () => {
      mockCommentRepository.findCommentByUserId.mockResolvedValue(null);

      await expect(
        service.updateComment(mockUser.channel.id, 999, mockCommentDto, mockUser),
      ).rejects.toThrow(NotFoundException);

      expect(mockCommentRepository.findCommentByUserId).toHaveBeenCalledWith(mockUser.id);
    });

    it('댓글 수정 성공 검증', async () => {
      mockCommentRepository.findCommentUserIdAndCommentIdAndVideoId.mockResolvedValue(mockComment);
      mockCommentRepository.updateComment.mockResolvedValue(undefined);
      mockCommentRepository.findCommentByCommentId.mockResolvedValue(mockComment);
      mockCommentRepository.findCommentByUserId.mockResolvedValue(mockUser);

      const result = await service.updateComment(mockVideo.id, 1, mockCommentDto, mockUser);

      expect(mockCommentRepository.updateComment).toHaveBeenCalledWith(1, 'Test Comment');
      expect(result).toEqual(mockComment);
    });

    it('존재하지 않는 댓글 수정 시 NotFoundException 발생 검증', async () => {
      mockCommentRepository.findCommentUserIdAndCommentIdAndVideoId.mockResolvedValue(mockComment);
      mockCommentRepository.findCommentByUserId.mockResolvedValue(mockUser);
      mockCommentRepository.deleteComment.mockResolvedValue({ affected: 1 });

      const result = await service.removeComment(mockVideo.id, 1, mockUser);

      expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true, message: 'Comment deleted successfully' });
    });
  });

  describe('removeComment', () => {
    it('댓글 삭제 성공', async () => {
      mockCommentRepository.findCommentUserIdAndCommentIdAndVideoId.mockResolvedValue(mockComment);
      mockCommentRepository.deleteComment.mockResolvedValue({ affected: 1 });

      const result = await service.removeComment(mockVideo.id, 1, mockUser);

      expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true, message: 'Comment deleted successfully' });
    });

    it('댓글 삭제 실패 시 예외 발생', async () => {
      mockCommentRepository.findCommentUserIdAndCommentIdAndVideoId.mockResolvedValue(mockComment);
      mockCommentRepository.findCommentByUserId.mockResolvedValue(mockUser);
      mockCommentRepository.deleteComment.mockResolvedValue({ affected: 0 });

      await expect(service.removeComment(mockVideo.id, 1, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('createReply', () => {
    it('답글 생성 성공 검증', async () => {
      mockCommentRepository.findCommentByCommentId.mockResolvedValue(mockComment);
      mockCommentRepository.findReplyByCommentGroup.mockResolvedValue({ orderNumber: 0 });
      mockCommentRepository.createReply.mockReturnValue(mockComment);
      mockCommentRepository.save.mockResolvedValue(mockComment);

      const result = await service.createReply(
        mockVideo.id,
        mockComment.id,
        mockUser,
        mockCommentDto,
      );

      expect(mockCommentRepository.createReply).toHaveBeenCalledWith(
        mockUser.id,
        mockCommentDto.content,
        mockComment.id,
        1,
        mockComment.commentGroup,
        mockVideo.id,
      );
      expect(mockCommentRepository.save).toHaveBeenCalledWith(mockComment);
      expect(result).toEqual(mockComment);
    });

    it('존재하지 않는 댓글에 답글 생성 시 예외 발생', async () => {
      mockCommentRepository.findCommentByCommentId.mockResolvedValue(null);

      await expect(service.createReply(mockVideo.id, 1, mockUser, mockCommentDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
