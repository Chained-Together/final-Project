import { UserEntity } from 'src/user/entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findByNickname(nickname: string): Promise<UserEntity | null>;
  findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null>;
  save(user: Partial<UserEntity>): Promise<UserEntity>;
  findByGoogleId(googleId: string): Promise<UserEntity | null>;
  findByNaverId(naverId: string): Promise<UserEntity | null>;
  createByGoogleId(email: string, displayName: string, googleId: string, num: number, num1: number);
  createByNaverId(email: string, nickname: string, naverId: string, num: number, num1: number);
}
