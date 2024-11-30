import { UserEntity } from '../../user/entities/user.entity';
import { VideoDto } from '../dto/video.dto';
import { Visibility } from '../video.visibility.enum';
import { VideoEntity } from '../entities/video.entity';
import { LikeEntity } from '../../like/entities/like.entity';
import { ChannelEntity } from '../../channel/entities/channel.entity';
import { ResolutionEntity } from '../../resolution/entities/resolution.entity';
import { UpdateVideoDto } from '../dto/update.video.dto';

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

// Channel Mock 데이터
export const mockChannel: ChannelEntity = {
  id: 1,
  name: 'testTV',
  profileImage: 'test',
  video: null,
  user: null,
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

// VideoDto Mock 데이터
export const videoDto: VideoDto = {
  title: 'Test Video',
  description: 'This is a test description',
  thumbnailUrl: 'https://example.com/thumbnail.jpg',
  hashtags: ['#test', '#video'],
  high: 'url',
  low: 'url',
  duration: 300,
  visibility: Visibility.PUBLIC,
  videoCode: '1',
};

// 추가 VideoDto Mock 데이터
export const mockVideoDto: VideoDto = {
  title: 'test',
  description: 'test',
  thumbnailUrl: 'test',
  duration: null,
  hashtags: ['공포', '강아지'],
  visibility: Visibility.PUBLIC,
  high: '임의 링크',
  low: '임의 링크',
  videoCode: '1',
};

// UpdateVideoDto Mock 데이터
export const mockUpdateVideoDto: UpdateVideoDto = {
  title: 'test',
  description: 'test',
  thumbnailUrl: 'test',
  hashtags: ['공포', '고양이'],
  visibility: Visibility.PUBLIC,
};

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

// Resolution Mock 데이터
export const mockResolution: ResolutionEntity = {
  id: 1,
  high: '임의 링크',
  low: '임의 링크',
  video: mockVideo,
};
