import { UserEntity } from 'src/user/entities/user.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'channel',
})
export class ChannelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int', nullable: false, name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', nullable: true })
  profileImage: string;

  @OneToMany(() => VideoEntity, (video) => video.channel, { cascade: true })
  video: VideoEntity;

  @OneToOne(() => UserEntity, (user) => user.channel, { cascade: true })
  user: UserEntity;
}
