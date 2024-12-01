import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { DeleteUserDto } from './dto/delete-user.dto';
import { HashingService } from 'src/interface/hashing-interface';
import { UpdateUserDto } from './dto/updata-User.dto';
import { FindPasswordDto } from './dto/found-password.dto';
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

  async findPassword(findPasswordDto: FindPasswordDto): Promise<void> {
    const { email, phoneNumber } = findPasswordDto;

    const findUser : UserEntity = await this.userRepository.findOne({
      where : {email : email}
    })

    if(!findUser){
      throw new NotFoundException('해당하는 사용자가 없습니다.');
    }

    if(findUser.phoneNumber !== phoneNumber){
      throw new UnauthorizedException('본인확인 정보가 일치하지 않습니다.');
    }
  }

  async deleteUserAccount( user: UserEntity ,deleteUserDto: DeleteUserDto ) {
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

  async updateUserProfile(user: UserEntity, updateUserDto: UpdateUserDto) {
    // 1. 사용자 확인
    const foundUser = await this.userRepository.findOne({ where: { id: user.id } });
    if (!foundUser) {
      throw new NotFoundException('유저가 존재하지 않거나, userId가 잘못되었습니다.');
    }

    await this.validateUniqueFields(user, updateUserDto);

    await this.userRepository.update(user.id, updateUserDto);

    return this.userRepository.findOne({ where: { id: user.id } });
  }

  private async validateUniqueFields(user: UserEntity, updateUserDto: UpdateUserDto) {
    const { email, nickname, phoneNumber, name } = updateUserDto;

    if (email) {
      const emailExists = await this.userRepository.findOne({
        where: { email, id: user.id },
      });
      if (emailExists) {
        throw new BadRequestException('해당 이메일은 이미 사용 중입니다.');
      }
    }

    if (nickname) {
      const nicknameExists = await this.userRepository.findOne({
        where: { nickname, id: user.id },
      });
      if (nicknameExists) {
        throw new BadRequestException('해당 닉네임은 이미 사용 중입니다.');
      }
    }

    if (phoneNumber) {
      const phoneExists = await this.userRepository.findOne({
        where: { phoneNumber, id: user.id },
      });
      if (phoneExists) {
        throw new BadRequestException('해당 전화번호는 이미 사용 중입니다.');
      }
    }

    if (name) {
      const nameExists = await this.userRepository.findOne({
        where: { name, id: user.id },
      });
      if (nameExists) {
        throw new BadRequestException('해당 이름은 이미 사용 중입니다.');
      }
    }
  }

  private async findUserById(user: UserEntity) {
    const foundUser = await this.userRepository.findOne({
      where : { id: user.id }
    })
    if (!foundUser) {
      throw new NotFoundException('유저가 존재하지 않거나, userId가 잘못되었습니다.');
    }
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
