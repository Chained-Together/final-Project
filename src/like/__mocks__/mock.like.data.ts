import { LikeEntity } from '../entities/like.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { VideoEntity } from '../../video/entities/video.entity';
import { ResolutionEntity } from '../../resolution/entities/resolution.entity';
import { ChannelEntity } from '../../channel/entities/channel.entity';
import { Visibility } from '../../video/video.visibility.enum';
import { CommentEntity } from '../../comment/entities/comment.entity';

export const mockUser: UserEntity = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedPassword',
  name: 'Test User',
  nickname: 'TestNickname',
  phoneNumber: '010-1234-5678',
  isSocial: false,
  googleId: null,
  naverId: null,
  deletedAt: null,
  likes: [], // 연결된 좋아요 추가 예정
  channel: null, // 연결된 채널 추가 예정
};

export const mockResolution: ResolutionEntity = {
  id: 1,
  high: 'https://example.com/high-res.mp4',
  low: 'https://example.com/low-res.mp4',
  video: null, // 연결된 비디오 추가 예정
};

export const mockChannel: ChannelEntity = {
  id: 1,
  name: 'Test Channel',
  profileImage: 'https://example.com/profile.jpg',
  video: null, // 연결된 비디오 추가 예정
  createdAt: new Date(),
  user: mockUser, // 채널 소유자 연결
};

export const mockComment: CommentEntity = {
  id: 1,
  userId: mockUser.id,
  content: 'Test Comment',
  parentComment: null,
  depth: 0,
  orderNumber: 1,
  commentGroup: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  video: null, // 연결된 비디오 추가 예정
};

export const mockVideo: VideoEntity = {
  id: 123,
  title: 'Test Video',
  description: 'This is a test video',
  thumbnailUrl: 'https://example.com/thumbnail.jpg',
  hashtags: ['#test', '#video'],
  visibility: Visibility.PUBLIC,
  duration: 120,
  views: 100,
  status: true,
  videoCode: 'abc123',
  accessKey: null,
  uploadedAt: new Date(),
  updatedAt: new Date(),
  resolution: mockResolution, // 해상도 연결
  channel: mockChannel, // 채널 연결
  likes: [], // 연결된 좋아요 추가 예정
  comments: null, // 댓글 데이터 추가
};

export const mockLike: LikeEntity = {
  id: 1,
  user: mockUser,
  video: mockVideo,
};

export const mockDeleteResult = {
  affected: 1,
};

export const mockLikeCount = 10; // 좋아요 개수

