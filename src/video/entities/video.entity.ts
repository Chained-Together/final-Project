import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResolutionsEntity } from './resolutions.entity';
import { ChannelEntity } from '../../channel/entities/channel.entity';
import { Visibility } from '../video.visibility.enum';
import { LikeEntity } from '../../like/entities/like.entity';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { bool, boolean } from 'joi';

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

  @Column({ type: 'text', nullable: false })
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

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'uploaded_at' })
  uploadedAt: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => ResolutionsEntity, (resolution) => resolution.video, { cascade: true })
  resolution: ResolutionsEntity;

  @ManyToOne(() => ChannelEntity, (channel) => channel.video, { onDelete: 'CASCADE' })
  channel: ChannelEntity;

  @OneToMany(() => LikeEntity, (like) => like.video)
  likes: LikeEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.video)
  comments: CommentEntity;
}
