import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FindPasswordDto } from './dto/findPassword.dto';
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

  //TODO: nodemailer,휴대폰 문자 인증,비밀번호 찾기 할때 지정 이메일로 비밀번호 변경 메일전송
  async findPassword(findPasswordDto: FindPasswordDto) {
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
}
