import { VideoEntity } from 'src/video/entities/video.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'resolutions',
})
export class ResolutionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  videoUrl: string;

  @OneToOne(() => VideoEntity, (video) => video.resolution, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'video_id', referencedColumnName: 'id' })
  video: VideoEntity;
}
