// import { ChannelEntity } from 'src/channel/entities/channel.entity';
// import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { LikeEntity } from '../../like/entities/like.entity';
//
// @Entity({
//   name: 'users',
// })
// export class UserEntity {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   @Column({ type: 'varchar', nullable: false, unique: true })
//   email: string;
//
//   @Column({ type: 'varchar', nullable: false })
//   password: string;
//
//   @Column({ type: 'varchar', nullable: false })
//   name: string;
//
//   @Column({ type: 'varchar', nullable: false, unique: true })
//   nickname: string;
//
//   @Column({ type: 'varchar', nullable: false, unique: true })
//   phoneNumber: string;
//
//   @OneToMany(() => LikeEntity, (like) => like.user)
//   likes: LikeEntity;
//
//   @OneToOne(() => ChannelEntity, (channel) => channel.user)
//   channel: ChannelEntity;
// }
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LikeEntity } from '../../like/entities/like.entity';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string; // 소셜 로그인 사용자의 경우 비밀번호는 nullable.

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  nickname: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  phoneNumber: string;

  @Column({ type: 'boolean', default: false })
  isSocial: boolean;

  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  googleId: string;

  @Column({ type: 'varchar', nullable: true })
  accessToken: string; // 구글 OAuth 액세스 토큰

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity;

  @OneToOne(() => ChannelEntity, (channel) => channel.user)
  channel: ChannelEntity;
}
