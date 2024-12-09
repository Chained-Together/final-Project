import { UserEntity } from '../entities/user.entity';
import { CommentDto } from '../../comment/dto/comment.dto';
import { mockLike } from '../../video/__mocks__/mock.video.data';

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
  channel: null,
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
// ./__mocks__/mock.user.data.ts


// Mock User Entity
export const mockUserEntity: UserEntity = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedpassword',
  name: 'Test User',
  nickname: 'testuser',
  phoneNumber: '010-1234-5678',
  deletedAt: null,
  likes: [],
  channel: null,
  isSocial: false,
  googleId: null,
  naverId: null,
};

// Mock Create User DTO
export const mockCreateUserDto = {
  email: 'test@example.com',
  password: 'password',
  confirmedPassword: 'password',
  name: 'Test User',
  nickname: 'testuser',
  phoneNumber: '010-1234-5678',
};

// Mock Invalid Create User DTO
export const mockInvalidCreateUserDto = {
  email: '',
  password: '',
  confirmedPassword: '',
  name: '',
  nickname: '',
  phoneNumber: '',
};

// Mock Delete User DTO
export const mockDeleteUserDto = {
  email: 'test@example.com',
  password: 'password123',
};

