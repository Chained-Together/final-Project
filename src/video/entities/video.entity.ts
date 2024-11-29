import { CommentEntity } from 'src/comment/entities/comment.entity';
import { ResolutionEntity } from 'src/resolution/entities/resolution.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChannelEntity } from '../../channel/entities/channel.entity';
import { LikeEntity } from '../../like/entities/like.entity';
import { Visibility } from '../video.visibility.enum';

@Entity({
  name: 'videos',
})
export class VideoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false, name: 'thumbnail_url' })
  thumbnailUrl: string;

  @Column({ type: 'json', nullable: false })
  hashtags: string[];

  @Column({ type: 'enum', enum: Visibility })
  visibility: Visibility;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  views: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  status: boolean;

  @Column({ type: 'varchar', nullable: false })
  videoCode: string;

  @Column({ type: 'varchar', nullable: true, name: 'access_key' })
  accessKey: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'uploaded_at' })
  uploadedAt: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => ResolutionEntity, (resolution) => resolution.video, { cascade: true })
  resolution: ResolutionEntity;

  @ManyToOne(() => ChannelEntity, (channel) => channel.video, { onDelete: 'CASCADE' })
  channel: ChannelEntity;

  @OneToMany(() => LikeEntity, (like) => like.video)
  likes: LikeEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.video)
  comments: CommentEntity;
}
