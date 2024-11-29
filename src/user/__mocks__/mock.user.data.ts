import { CreateUserDto } from '../dto/create-user.dto';
import { ChannelEntity } from '../../channel/entities/channel.entity';
import { LikeEntity } from '../../like/entities/like.entity';
import { UserEntity } from '../entities/user.entity';
import { VideoEntity } from '../../video/entities/video.entity';
import { DeleteUserDto } from '../dto/delete-user.dto';

export const mockCreateUserDto: CreateUserDto = {
  name: 'Test User',
  phoneNumber: '010-1234-5678',
};

export const mockUserResponse = {
  email: 'test@example.com',
  verified: true,
};

export const mockInvalidCreateUserDto: CreateUserDto = {
  name: 'Invalid User',
  phoneNumber: '010-9876-5432',
};

export const mockErrorMessage = '해당하는 사용자가 없습니다.';

export const mockVideo: VideoEntity = {
  id: 1,
  title: 'Test Video',
  description: 'Test Description',
  thumbnailUrl: 'https://example.com/thumbnail.jpg',
  hashtags: ['#test', '#video'],
  visibility: null,
  duration: 300,
  views: 100,
  uploadedAt: new Date(),
  updatedAt: new Date(),
  resolution: null,
  channel: null, // 관계는 이후에 설정
  likes: [],
  videoCode: 'testCode',
  status: true,
  comments: null,
  accessKey: null,
};

export const mockChannel: ChannelEntity = {
  id: 1,
  name: 'Testname',
  profileImage: 'https://example.com/channel.jpg',
  video: null,
  user: null,
};

export const mockLike: LikeEntity = {
  id: 1,
  user: null,
  video: mockVideo,
};

export const mockUserEntity: UserEntity = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedPassword',
  name: 'TestUser',
  nickname: 'TestM',
  phoneNumber: '010-1234-1234',
  deletedAt: null,
  likes: [mockLike],
  channel: mockChannel,
};

export const mockDeleteUserDto: DeleteUserDto = {
  email: 'invalid@example.com',
  password: 'password',
};
