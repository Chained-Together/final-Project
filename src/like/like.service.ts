import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IChannelRepository } from 'src/interface/channel-interface';
import { ILikeRepository } from 'src/interface/like-interface';
import { NotificationService } from '../notification/notification.service';
import { INotificationRepository } from 'src/interface/notification-interface';

@Injectable()
export class LikeService {
  constructor(
    @Inject('IChannelRepository')
    private readonly channelRepository: IChannelRepository,
    @Inject('ILikeRepository')
    private readonly likeRepository: ILikeRepository,
    private readonly notificationService: NotificationService,
  ) {}
  async toggleLike(userId: number, videoId: number) {
    if (!userId || !videoId) {
      throw new BadRequestException('유저 ID와 비디오 ID는 필수입니다.');
    }

    const findLike = await this.likeRepository.findLikeByUserIdAndVideoId(userId, videoId);

    let word = '눌렀습니다.';
    findLike ? (word = '취소했습니다.') : word;

    const message = `${userId}님이 ${videoId} 영상에 좋아요를 ${word}`;
    if (findLike) {
      console.log('알림 보내기 전');
      this.notificationService.emitNotification(message, videoId);
      console.log('알림 성공');
      return await this.likeRepository.deleteLike(userId, videoId);
    }

    const foundChannel = await this.channelRepository.findChannelByVideoJoinUser(videoId);

    if (!foundChannel) {
      throw new NotFoundException('비디오와 연결된 채널을 찾을 수 없습니다.');
    }

    await this.notificationService.emitNotification(message, videoId);

    return await this.likeRepository.saveLike(userId, videoId);
  }

  async getLikes(videoId: number) {
    if (!videoId) {
      throw new BadRequestException('비디오 ID는 필수입니다.');
    }

    return await this.likeRepository.countLike(videoId);
  }
}
