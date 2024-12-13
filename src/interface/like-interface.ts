import { LikeEntity } from 'src/like/entities/like.entity';
import { DeleteResult } from 'typeorm';

export interface ILikeRepository {
  findLikeByUserIdAndVideoId(userId: number, videoId: number): Promise<LikeEntity>;
  saveLike(userId: number, videoId: number): Promise<LikeEntity>;
  deleteLike(userId: number, videoId: number): Promise<DeleteResult>;
  countLike(videoId: number): Promise<Number>;
}
