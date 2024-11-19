import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CommentDto } from './dto/comment.dto';

describe('CommentController', () => {
  let commentController: CommentController;
  let commentService: CommentService;

  const mockCommentService = {
    createComment: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateComment: jest.fn(),
    removeComment: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'password',
    name: 'name',
    nickname: 'nickname',
    phoneNumber: '010-0000-0000',
  } as UserEntity;

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
      .useValue({ canActivate: () => true })
      .compile();

    commentController = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(commentController).toBeDefined();
  });

  describe('댓글 생성', () => {
    it('댓글 생성 메서드 검증', async () => {
      const commentDto: CommentDto = { content: 'Content' };
      const videoId: number = 1;

      await commentController.createComment(videoId, mockUser, commentDto);

      expect(commentService.createComment).toHaveBeenCalledWith(commentDto, mockUser, videoId);
    });
  });

  describe('댓글 전체 조회', () => {
    it('댓글 전체 조회 메서드 검증', async () => {
      const videoId: number = 1;
      await commentController.findAll(videoId);

      expect(commentService.findAll).toHaveBeenCalledWith(videoId);
    });
  });

  describe('댓글 상세 조회', () => {
    it('댓글 상세 조회 메서드 검증', async () => {
      const videoId: number = 1;
      const commentId: number = 1;

      await commentController.findOne(videoId, commentId);

      expect(commentService.findOne).toHaveBeenCalledWith(videoId, commentId);
    });
  });

  describe('댓글 수정', () => {
    it('댓글 수정 메서드 검증', async () => {
      const commentDto: CommentDto = { content: 'Content' };
      const videoId: number = 1;
      const commentId: number = 1;

      await commentController.updateComment(videoId, commentId, commentDto, mockUser);

      expect(commentService.updateComment).toHaveBeenCalledWith(
        videoId,
        commentId,
        commentDto,
        mockUser,
      );
    });
  });

  describe('댓글 삭제', () => {
    it('댓글 삭제 메서드 검증', async () => {
      const videoId: number = 1;
      const commentId: number = 1;

      await commentController.removeComment(videoId, commentId, mockUser);

      expect(commentService.removeComment).toHaveBeenCalledWith(videoId, commentId, mockUser);
    });
  });
});
