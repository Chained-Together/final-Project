import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity({ name: 'notifications' })
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  message: string;

  @Column({ type: 'boolean', default: false })
  type: boolean;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;
}
