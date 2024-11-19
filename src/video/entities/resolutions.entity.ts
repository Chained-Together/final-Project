import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { VideoEntity } from './video.entity';

@Entity({
  name: 'resolutions',
})
export class ResolutionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  high: string;

  @Column()
  low: string;

  @OneToOne(() => VideoEntity, (video) => video.resolution, { onDelete: 'CASCADE' })
  video: VideoEntity;
}
