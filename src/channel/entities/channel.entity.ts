import { VideoEntity } from 'src/video/entities/video.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'channel',
})
export class ChannelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int', nullable: false, name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', nullable: false })
  profileImage: string;

  @OneToMany(() => VideoEntity, (video) => video.channel, { cascade: true })
  video: VideoEntity;
}
