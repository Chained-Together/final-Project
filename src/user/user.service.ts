import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}
  async findEmail(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOneBy(createUserDto);
    if (!user) {
      throw new NotFoundException('해당하는 사용자가 없습니다.');
    }
    return { email: user.email };
  }
}
