import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { VideoEntity } from '../../video/entities/video.entity';

@Entity({
  name: 'like',
})
export class LikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.likes, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => VideoEntity, (video) => video.likes, { onDelete: 'CASCADE' })
  video: VideoEntity;
}
