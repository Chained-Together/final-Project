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
  name: 'obsStreamKey',
})
export class ObsStreamKeyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  streamKey: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'varchar', nullable: true })
  streamingUrl: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @OneToOne(() => UserEntity, (user) => user.obsStreamKey, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
}
