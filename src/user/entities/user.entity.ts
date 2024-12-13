import { ChannelEntity } from 'src/channel/entities/channel.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LikeEntity } from '../../like/entities/like.entity';
import { LiveStreamingEntity } from 'src/liveStreaming/entities/liveStreaming.entity';
import { ObsStreamKeyEntity } from 'src/obs/entities/obs.entity';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string; // 소셜 로그인 사용자의 경우 비밀번호는 nullable.

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  nickname: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  phoneNumber: string;

  @Column({ type: 'boolean', default: false })
  isSocial: boolean;

  @Column({ type: 'varchar', nullable: true, unique: true })
  googleId: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  naverId: string;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date | null;

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity[];

  @OneToOne(() => ChannelEntity, (channel) => channel.user)
  @JoinColumn()
  channel: ChannelEntity;

  @OneToOne(() => ObsStreamKeyEntity, (obsStreamKey) => obsStreamKey.user)
  obsStreamKey: ObsStreamKeyEntity;

  @OneToOne(() => LiveStreamingEntity, (liveStreaming) => liveStreaming.user)
  liveStreaming: LiveStreamingEntity;
}
