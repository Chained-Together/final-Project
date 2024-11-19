import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeEntity } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
  ) {}
  // TODO : 예외처리하기
  async toggleLike(videoId: number, userId: number) {
    const findLike = await this.likeRepository.findOne({
      where: {
        user: { id: userId },
        video: { id: videoId },
      },
    });

    if (findLike) {
      return await this.likeRepository.delete({
        user: { id: userId },
        video: { id: videoId },
      });
    }
    return await this.likeRepository.save({
      user: { id: userId },
      video: { id: videoId },
    });
  }
}
