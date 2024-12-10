import { UpdateUserDto } from 'src/user/dto/updata-User.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findByNickname(nickname: string): Promise<UserEntity | null>;
  findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null>;
  save(user: Partial<UserEntity>): Promise<UserEntity>;
  findByGoogleId(googleId: string): Promise<UserEntity | null>;
  findByNaverId(naverId: string): Promise<UserEntity | null>;
  createByGoogleId(
    email: string,
    displayName: string,
    googleId: string,
    num: number,
    num1: number,
  ): UserEntity;
  createByNaverId(
    email: string,
    nickname: string,
    naverId: string,
    num: number,
    num1: number,
  ): UserEntity;
  findUserByNameAndPhoneNumber(name: string, phoneNumber: string): Promise<UserEntity | null>;
  deleteUser(userId: number): Promise<DeleteResult>;
  findUserByUserId(userId: number): Promise<UserEntity | null>;
  updateUser(userId: number, updateData: UpdateUserDto): Promise<UpdateResult>;
}
