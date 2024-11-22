import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VideoEntity } from './video.entity';

@Entity({
  name: 'resolutions',
})
export class ResolutionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  high: string;

  @Column({ type: 'varchar', nullable: true })
  low: string;

  @OneToOne(() => VideoEntity, (video) => video.resolution, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'video_id', referencedColumnName: 'id' })
  video: VideoEntity;
}
