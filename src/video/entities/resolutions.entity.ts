import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { VideoEntity } from './video.entity';

@Entity({
  name: 'resolutions',
})
export class ResolutionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  profileImage: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'int', nullable: false, name: 'user_id' })
  userId: number;

  @OneToOne(() => VideoEntity, (video) => video.resolution, { onDelete: 'CASCADE' })
  video: VideoEntity;
}
