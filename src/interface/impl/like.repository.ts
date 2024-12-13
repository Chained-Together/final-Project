import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeEntity } from 'src/like/entities/like.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ILikeRepository } from '../like-interface';

@Injectable()
export class LikeRepository implements ILikeRepository {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly repository: Repository<LikeEntity>,
  ) {}
  findLikeByUserIdAndVideoId(userId: number, videoId: number): Promise<LikeEntity> {
    return this.repository.findOne({
      where: {
        user: { id: userId },
        video: { id: videoId },
      },
    });
  }
  saveLike(userId: number, videoId: number): Promise<LikeEntity> {
    return this.repository.save({
      user: { id: userId },
      video: { id: videoId },
    });
  }
  deleteLike(userId: number, videoId: number): Promise<DeleteResult> {
    return this.repository.delete({
      user: { id: userId },
      video: { id: videoId },
    });
  }
  countLike(videoId: number): Promise<Number> {
    return this.repository.count({
      where: { video: { id: videoId } },
    });
  }
}
