import {
  Column,
  CreateDateColumn,
  Entity,
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

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Timestamp;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt: Timestamp;

  //   @ManyToOne(() => VideoEntity, (video) => video.comments, { onDelete: 'CASCADE' })
  //   video: VideoEntity;

  //   @OneToMany(() => Replies, (replies) => replies.comment, { cascade: true })
  //   replies: Replies[];
}
