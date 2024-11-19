import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelEntity } from '../../channel/entities/channel.entity';
import { UserEntity } from '../../user/entity/user.entity';
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
