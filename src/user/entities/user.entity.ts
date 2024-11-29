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

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  nickname: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  phoneNumber: string;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date | null;

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity;

  @OneToOne(() => ChannelEntity, (channel) => channel.user)
  @JoinColumn()
  channel: ChannelEntity;
}
