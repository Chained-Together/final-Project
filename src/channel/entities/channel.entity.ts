import { UserEntity } from 'src/user/entities/user.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'channel',
})
export class ChannelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true, default: '/public/images/user-50.png' })
  profileImage: string;

  @OneToMany(() => VideoEntity, (video) => video.channel, { cascade: true })
  video: VideoEntity;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @OneToOne(() => UserEntity, (user) => user.channel, { cascade: true })
  @JoinColumn()
  user: UserEntity;
}
