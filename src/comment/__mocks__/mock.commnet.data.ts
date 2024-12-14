import { UserEntity } from '../../user/entities/user.entity';
import { mockChannel, mockLike } from '../../video/__mocks__/mock.video.data';
import { CommentDto } from '../dto/comment.dto';

export const mockCreateUserDto = {
  name: 'Test User',
  phoneNumber: '010-1234-5678',
};

export const mockUserResponse = {
  email: 'testuser@example.com',
  verified: true,
};

export const mockInvalidCreateUserDto = {
  name: 'Invalid User',
  phoneNumber: '010-9876-5432',
};

export const mockErrorMessage = '해당하는 사용자가 없습니다.';

export const mockUser: UserEntity = {
  id: 1,
  email: 'testuser@example.com',
  password: 'hashedPassword123',
  name: 'Test User',
  nickname: 'testnickname',
  phoneNumber: '010-1234-5678',
  isSocial: false,
  googleId: null,
  naverId: null,
  deletedAt: null,
  likes: [mockLike],
  channel: mockChannel,
  obsStreamKey: null,
  liveStreaming: null,
};

export const mockCommentDto: CommentDto = {
  content: 'Test Comment',
};

export const mockUpdatedCommentDto: CommentDto = {
  content: 'Updated Comment',
};

export const mockComment = {
  id: 1,
  content: mockCommentDto.content,
  videoId: 1,
  userId: mockUser.id,
  commentGroup: 1,
  depth: 0,
  parentCommentId: 0,
  orderNumber: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockUpdatedComment = {
  ...mockComment,
  content: mockUpdatedCommentDto.content,
};

export const mockReplyComment = {
  id: 2,
  content: mockCommentDto.content,
  videoId: 1,
  userId: mockUser.id,
  commentGroup: 1,
  depth: 1,
  parentCommentId: 1,
  orderNumber: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCommentResponse = {
  success: true,
  message: 'Comment deleted',
};
export const mockCommentCreationDto: CommentDto = {
  content: 'This is a test comment',
};

export const mockCommentCreationResponse = {
  id: 1,
  userId: mockUser.id,
  content: mockCommentCreationDto.content,
  videoId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const mockCommentList = [
  {
    id: 1,
    content: 'First comment',
    userId: mockUser.id,
    videoId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    content: 'Second comment',
    userId: mockUser.id,
    videoId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
export const mockUpdatedCommentData = {
  id: 1,
  content: 'Updated comment content',
  userId: mockUser.id,
  videoId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCommentDeletionResponse = {
  success: true,
  message: 'Comment deleted successfully',
};

export const mockReplyCreationDto: CommentDto = {
  content: 'This is a test reply',
};

export const mockReplyResponse = {
  id: 2,
  userId: mockUser.id,
  content: mockReplyCreationDto.content,
  parentCommentId: 1,
  videoId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};
