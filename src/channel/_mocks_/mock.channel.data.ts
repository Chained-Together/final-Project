import { UserEntity } from '../../user/entities/user.entity';
import { VideoEntity } from '../../video/entities/video.entity';
import { LikeEntity } from '../../like/entities/like.entity';
import { ChannelEntity } from '../../channel/entities/channel.entity';
import { ChannelDto } from '../dto/channel.dto';
import { Visibility } from '../../video/video.visibility.enum';

export const mockUser: UserEntity = {
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
  googleId: 'google@google.com',
  naverId: 'naverId@naver.com',
};

export const mockChannel: ChannelEntity = {
    id: 1,
    name: 'testTV',
    profileImage: 'test',
    video: null,
    user: mockUser,
    createdAt: new Date(),
  };

// Video Mock 데이터
export const mockVideo: VideoEntity = {
  id: 1,
  title: 'Test Video',
  description: 'This is a test description',
  thumbnailUrl: 'https://example.com/thumbnail.jpg',
  hashtags: ['#test', '#video'],
  visibility: Visibility.PUBLIC,
  duration: 300,
  views: 100,
  status: true,
  videoCode: '1',
  accessKey: 'secret_key',
  uploadedAt: new Date(),
  updatedAt: new Date(),
  resolution: null, // 초기값으로 null
  channel: mockChannel,
  likes: [], // 초기값으로 빈 배열
  comments: null, // 초기값으로 null
};

// Channel Mock 데이터


// Like Mock 데이터
export const mockLike: LikeEntity = {
  id: 1,
  user: mockUser, // mockUser 참조
  video: mockVideo, // mockVideo 참조
};

// Mock 관계 설정
mockUser.likes = [mockLike];
mockVideo.likes = [mockLike];

// Video 리스트 Mock 데이터
export const mockVideos: VideoEntity[] = [
  { ...mockVideo, id: 2, title: 'Another Video' },
  { ...mockVideo, id: 3, title: 'More Videos' },
];



// Updated Video Mock 데이터
export const mockUpdatedVideo: VideoEntity = {
  id: 1,
  title: 'test',
  description: 'test',
  thumbnailUrl: 'test',
  hashtags: ['공포', '고양이'],
  visibility: Visibility.PUBLIC,
  duration: null,
  views: 0,
  uploadedAt: new Date(),
  updatedAt: new Date(),
  resolution: null,
  channel: mockChannel,
  likes: [], // 업데이트 후 빈 배열
  videoCode: '1',
  status: false,
  comments: null,
  accessKey: null,
};


export const channelDto: ChannelDto = {
    name: 'test',
    profileImage: 'image',
  };


  
  export const mockUpdatedChannelDto: ChannelDto = {
    name: 'test1',
    profileImage: 'image',
  };

  export const mockUpdatedChannel: ChannelEntity = {
    id: 1,
    name: 'test1',
    profileImage: 'image',
    video: null,
    user: mockUser,
    createdAt: new Date(),
  };


 