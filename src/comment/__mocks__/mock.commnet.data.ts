import { UserEntity } from '../../user/entities/user.entity';
import { CommentDto } from '../dto/comment.dto';
import { mockChannel, mockLike } from '../../video/__mocks__/mock.video.data';

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
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockUpdatedComment = {
  ...mockComment,
  content: mockUpdatedCommentDto.content,
};

export const mockReplyComment = {
  id: 2,
  content: 'Reply Comment',
  videoId: 1,
  userId: mockUser.id,
  parentCommentId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCommentResponse = {
  success: true,
  message: 'Comment deleted',
};
