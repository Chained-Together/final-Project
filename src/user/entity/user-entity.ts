import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  nickname: string;

  @Column({ type: 'varchar', nullable: false, unique: true, name: 'phone_name' })
  phoneNumber: string;
}
