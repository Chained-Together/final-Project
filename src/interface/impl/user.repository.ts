import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../IUserRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class userRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}
  createByNaverId(email: string, nickname: string, naverId: string, num: number, num1: number) {
    return this.repository.create({
      email,
      nickname,
      name: nickname,
      naverId,
      phoneNumber: `010-${num}-${num1}`,
      isSocial: true,
    });
  }

  createByGoogleId(
    email: string,
    displayName: string,
    googleId: string,
    num: number,
    num1: number,
  ) {
    return this.repository.create({
      email,
      name: displayName,
      googleId,
      isSocial: true,
      nickname: displayName,
      phoneNumber: `010-${num}-${num1}`,
    });
  }

  findByGoogleId(googleId: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { googleId } });
  }

  findByNaverId(naverId: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { naverId } });
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  findByNickname(nickname: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { nickname } });
  }

  findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { phoneNumber } });
  }

  save(user: Partial<UserEntity>): Promise<UserEntity> {
    return this.repository.save(user);
  }
}
