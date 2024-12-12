import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { mockCommentService } from './__mocks__/mock.comment.service';
import {
  mockComment,
  mockCommentDto,
  mockCommentResponse,
  mockReplyComment,
  mockUpdatedComment,
  mockUser,
} from './__mocks__/mock.commnet.data';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

describe('CommentController', () => {
  let commentController: CommentController;
  let commentService: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: mockCommentService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    commentController = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(commentController).toBeDefined();
  });

  describe('createComment', () => {
    it('댓글을 생성해야 합니다.', async () => {
      mockCommentService.createComment.mockResolvedValue(mockComment);

      const result = await commentController.createComment(
        mockComment.videoId,
        mockUser,
        mockCommentDto,
      );

      expect(result).toEqual(mockComment);
      expect(mockCommentService.createComment).toHaveBeenCalledWith(
        mockCommentDto,
        mockUser,
        mockComment.videoId,
      );
    });
  });

  describe('findAll', () => {
    it('비디오에 대한 모든 댓글을 반환해야 합니다.', async () => {
      mockCommentService.findAll.mockResolvedValue([mockComment]);

      const result = await commentController.findAll(mockComment.videoId);

      expect(result).toEqual([mockComment]);
      expect(mockCommentService.findAll).toHaveBeenCalledWith(mockComment.videoId);
    });
  });

  describe('findOne', () => {
    it('특정 댓글을 반환해야 합니다.', async () => {
      mockCommentService.findOne.mockResolvedValue(mockComment);

      const result = await commentController.findOne(mockComment.videoId, mockComment.id);

      expect(result).toEqual(mockComment);
      expect(mockCommentService.findOne).toHaveBeenCalledWith(mockComment.videoId, mockComment.id);
    });
  });

  describe('updateComment', () => {
    it('댓글을 업데이트해야 합니다.', async () => {
      mockCommentService.updateComment.mockResolvedValue(mockUpdatedComment);

      const result = await commentController.updateComment(
        mockComment.videoId,
        mockComment.id,
        mockUpdatedComment,
        mockUser,
      );

      expect(result).toEqual(mockUpdatedComment);
      expect(mockCommentService.updateComment).toHaveBeenCalledWith(
        mockComment.videoId,
        mockComment.id,
        mockUpdatedComment,
        mockUser,
      );
    });
  });

  describe('removeComment', () => {
    it('댓글을 삭제하고 성공 메시지를 반환해야 합니다.', async () => {
      mockCommentService.removeComment.mockResolvedValue(mockCommentResponse);

      const result = await commentController.removeComment(
        mockComment.videoId,
        mockComment.id,
        mockUser,
      );

      expect(result).toEqual(mockCommentResponse);
      expect(mockCommentService.removeComment).toHaveBeenCalledWith(
        mockComment.videoId,
        mockComment.id,
        mockUser,
      );
    });
  });

  describe('createReply', () => {
    it('대댓글을 생성해야 합니다.', async () => {
      mockCommentService.createReply.mockResolvedValue(mockReplyComment);

      const result = await commentController.createReply(
        mockReplyComment.videoId,
        mockReplyComment.parentCommentId,
        mockUser,
        mockCommentDto,
      );

      expect(result).toEqual(mockReplyComment);
      expect(mockCommentService.createReply).toHaveBeenCalledWith(
        mockReplyComment.videoId,
        mockReplyComment.parentCommentId,
        mockUser,
        mockCommentDto,
      );
    });
  });
});
