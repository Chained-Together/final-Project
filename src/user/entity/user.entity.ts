import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { VideoEntity } from '../../video/entities/video.entity';
import { LikeEntity } from '../../like/entities/like.entity';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  nickname: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  phoneNumber: string;

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity;
}
