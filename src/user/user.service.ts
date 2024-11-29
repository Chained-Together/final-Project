import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { DeleteUserDto } from './dto/delete-user.dto';
import { HashingService } from 'src/interface/hashing-interface';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject('HashingService')
    private readonly bcryptHashingService: HashingService,
  ) {}
  async findEmail(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOneBy(createUserDto);
    if (!user) {
      throw new NotFoundException('해당하는 사용자가 없습니다.');
    }
    return { email: user.email };
  }

  //todo 11/27 : 회원탈퇴 / 회원정보 수정 / 해당기능 프론트 버튼에 연결
  async deleteUserAccount(user: UserEntity, deleteUserDto: DeleteUserDto) {
    try {
      await this.findUserEmail(deleteUserDto);
      await this.verifyPassword(deleteUserDto);

      await this.userRepository.softDelete({ id: user.id });
      return { message: '회원탈퇴 성공' };
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException(
        `사용자 계정을 삭제하는 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류가 발생했습니다.'}`,
      );
    }
  }

  private async findUserById(id: number) {
    const foundUser = await this.userRepository.findOne({
      where: { id },
    });
    return foundUser;
  }

  private async findUserEmail(deleteUserDto: DeleteUserDto) {
    const foundEmail = await this.userRepository.findOne({ where: { email: deleteUserDto.email } });
    if (!foundEmail) throw new NotFoundException('해당 이메일의 사용자가 존재하지 않습니다.');

    return foundEmail;
  }

  private async verifyPassword(deleteUserDto: DeleteUserDto) {
    const foundUser = this.findUserEmail(deleteUserDto);
    const foundPassword = await this.bcryptHashingService.compare(
      deleteUserDto.password,
      (await foundUser).password,
    );
    if (!foundPassword) {
      throw new UnauthorizedException('비밀 번호가 일치 하지 않습니다.');
    }
  }
}
