import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';

describe('CommentController', () => {
  let commentController: CommentController;
  let commentService: CommentService;

  const mockCommentService = {
    createComment: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updatedComment: jest.fn(),
    removeComment: jest.fn(),
  };

  const mockUser = {};

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
});
