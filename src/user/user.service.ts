import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from 'src/interface/hashing-interface';
import { IUserRepository } from 'src/interface/IUserRepository';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/updata-User.dto';
import { UserEntity } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('HashingService')
    private readonly bcryptHashingService: HashingService,
  ) {}
  async findEmail(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findUserByNameAndPhoneNumber(
      createUserDto.name,
      createUserDto.phoneNumber,
    );
    if (!user) {
      throw new NotFoundException('해당하는 사용자가 없습니다.');
    }
    return { email: user.email };
  }

  async deleteUserAccount(user: UserEntity, deleteUserDto: DeleteUserDto) {
    try {
      await this.findUserEmail(deleteUserDto.email);
      await this.verifyPassword(deleteUserDto);

      await this.userRepository.deleteUser(user.id);
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
    const foundUser = await this.userRepository.findUserByUserId(user.id);
    if (!foundUser) {
      throw new NotFoundException('유저가 존재하지 않거나, userId가 잘못되었습니다.');
    }

    await this.validateUniqueFields(user, updateUserDto);

    await this.userRepository.updateUser(user.id, updateUserDto);

    return foundUser;
  }

  private async validateUniqueFields(user: UserEntity, updateUserDto: UpdateUserDto) {
    const { email, nickname, phoneNumber, name } = updateUserDto;

    if (email) {
      const emailExists = await this.userRepository.findByEmail(email);
      if (emailExists) {
        throw new BadRequestException('해당 이메일은 이미 사용 중입니다.');
      }
    }

    if (nickname) {
      const nicknameExists = await this.userRepository.findByNickname(nickname);
      if (nicknameExists) {
        throw new BadRequestException('해당 닉네임은 이미 사용 중입니다.');
      }
    }

    if (phoneNumber) {
      const phoneExists = await this.userRepository.findByPhoneNumber(phoneNumber);
      if (phoneExists) {
        throw new BadRequestException('해당 전화번호는 이미 사용 중입니다.');
      }
    }
  }

  private async findUserById(user: UserEntity) {
    const foundUser = await this.userRepository.findUserByUserId(user.id);
    if (!foundUser) {
      throw new NotFoundException('유저가 존재하지 않거나, userId가 잘못되었습니다.');
    }
    return foundUser;
  }

  private async findUserEmail(email: string) {
    const foundEmail = await this.userRepository.findByEmail(email);
    if (!foundEmail) throw new NotFoundException('해당 이메일의 사용자가 존재하지 않습니다.');

    return foundEmail;
  }

  private async verifyPassword(deleteUserDto: DeleteUserDto) {
    const foundUser = this.findUserEmail(deleteUserDto.email);
    const foundPassword = await this.bcryptHashingService.compare(
      deleteUserDto.password,
      (await foundUser).password,
    );
    if (!foundPassword) {
      throw new UnauthorizedException('비밀 번호가 일치 하지 않습니다.');
    }
  }
}
