import { UserEntity } from 'src/user/entities/user.entity';
import { NotificationEntity } from '../entities/notification.entity';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { Visibility } from 'src/video/video.visibility.enum';

export const mockUser: UserEntity = {
  id: 1,
  email: 'test@test.com',
  password: 'password',
  name: 'name',
  nickname: 'nickname',
  phoneNumber: '101-1010-1001',
  deletedAt: new Date(),
  likes: null,
  channel: null,
};

export const mockNotification: NotificationEntity = {
  id: 1,
  message: '알림 입니다.',
  userId: 1,
  createdAt: new Date(),
  type: false,
};

export const mockVideo: VideoEntity = {
  id: 1,
  title: 'title',
  description: 'description',
  thumbnailUrl: 'thumbnailUrl',
  hashtags: ['hashtags'],
  visibility: Visibility.PUBLIC,
  duration: 10,
  views: 10,
  status: true,
  videoCode: 'videoCode',
  accessKey: 'accessKey',
  uploadedAt: new Date(),
  updatedAt: new Date(),
  resolution: null,
  channel: null,
  likes: null,
  comments: null,
};

export const mockChannel: ChannelEntity = {
  id: 1,
  name: '채널이름',
  profileImage: 'profile image',
  createdAt: new Date(),
  user: mockUser,
  video: mockVideo,
};
