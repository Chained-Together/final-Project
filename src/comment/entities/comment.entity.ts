import { VideoEntity } from 'src/video/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
@Entity({
  name: 'comments',
})
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'int', nullable: true })
  parentComment: number;

  @Column({ type: 'int', nullable: false })
  depth: number;

  @Column({ type: 'int', nullable: false })
  orderNumber: number;

  @Column({ type: 'int', nullable: false })
  commentGroup: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt: Date;

  @ManyToOne(() => VideoEntity, (video) => video.comments, { onDelete: 'CASCADE' })
  video: VideoEntity;
}
