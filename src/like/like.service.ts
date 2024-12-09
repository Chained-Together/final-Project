import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeEntity } from './entities/like.entity';
import { NotificationService } from '../notification/notification.service';
import { ChannelEntity } from 'src/channel/entities/channel.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
    private readonly notificationService: NotificationService,
  ) {}
  async toggleLike(userId: number, videoId: number) {

    if (!userId || !videoId) {
      throw new BadRequestException('유저 ID와 비디오 ID는 필수입니다.');
    }
    
    const findLike = await this.likeRepository.findOne({
      where: {
        user: { id: userId },
        video: { id: videoId },
      },
    });

    let word = '눌렀습니다.';
    findLike ? (word = '취소했습니다.') : word;

    const message = `${userId}님이 ${videoId} 영상에 좋아요를 ${word}`;
    if (findLike) {
      this.notificationService.emitNotification(message, videoId);
      return await this.likeRepository.delete({
        user: { id: userId },
        video: { id: videoId },
      });
    }

    const foundChannel = await this.channelRepository.findOne({
      where: { video: { id: videoId } },
      relations: ['user'],
    });

    if (!foundChannel) {
      throw new NotFoundException('비디오와 연결된 채널을 찾을 수 없습니다.');
    }

    await this.notificationService.emitNotification(message, videoId);

    return await this.likeRepository.save({
      user: { id: userId },
      video: { id: videoId },
    });
  }

  async getLikes(videoId: number) {

    if (!videoId) {
      throw new BadRequestException('비디오 ID는 필수입니다.');
    }

    const getLikes = await this.likeRepository.count({
      where: { video: { id: videoId } },
    });

    return getLikes;
  }
}
