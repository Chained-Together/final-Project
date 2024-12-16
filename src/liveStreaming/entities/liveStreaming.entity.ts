import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'liveStreaming',
})
export class LiveStreamingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'int', default: 0 })
  viewer: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @OneToOne(() => UserEntity, (user) => user.liveStreaming, { onDelete: 'CASCADE' })
  @JoinColumn({name:'user_id'})
  user: UserEntity;
}
