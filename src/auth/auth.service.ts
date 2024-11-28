import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/interface/hashing-interface';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signUp.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    @Inject('HashingService')
    private readonly bcryptHashingService: HashingService,
  ) {}

  async signUp(signUpDto: SignUpDto, req: Request) {
    const checkCode: boolean = await this.verifyCode(signUpDto.code, req);
    if (!checkCode) {
      throw new BadRequestException('인증 코드가 일치하지 않습니다.');
    }
    const findUser = await this.userRepository.findOne({
      where: {
        email: signUpDto.email,
      },
    });

    if (findUser) {
      throw new BadRequestException('이미 사용중인 이메일입니다.');
    }

    if (signUpDto.password !== signUpDto.confirmedPassword) {
      throw new BadRequestException('비밀번호가 일치 하지 않습니다.');
    }

    const findNickname = await this.userRepository.findOne({
      where: {
        nickname: signUpDto.nickname,
      },
    });

    if (findNickname) {
      throw new BadRequestException('이미 사용중인 닉네임입니다.');
    }

    const findPhoneNumber = await this.userRepository.findOne({
      where: {
        phoneNumber: signUpDto.phoneNumber,
      },
    });

    if (findPhoneNumber) {
      throw new BadRequestException('이미 사용중인 전화번호입니다.');
    }

    const hashedPassword = await this.bcryptHashingService.hash(signUpDto.password);

    await this.userRepository.save({
      email: signUpDto.email,
      password: hashedPassword,
      name: signUpDto.name,
      nickname: signUpDto.nickname,
      phoneNumber: signUpDto.phoneNumber,
    });
  }

  async logIn(loginDto: LoginDto) {
    const findUser = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!findUser) {
      throw new UnauthorizedException('존재하지 않는 사용자 입니다. 회원 가입을 진행해 주세요.');
    }

    if (!(await this.bcryptHashingService.compare(loginDto.password, findUser.password))) {
      throw new UnauthorizedException('비밀 번호가 일치 하지 않습니다.');
    }

    const payload = { email: loginDto.email, sub: findUser.id };
    const token = this.jwtService.sign(payload);
    console.log(token);

    return {
      access_token: token,
    };
  }
  private async verifyCode(code: string, req: Request): Promise<boolean> {
    return code === req.session.code;
  }
  async googleLogin(req: any): Promise<{ access_token: string }> {
    if (!req.user) {
      throw new Error('구글 인증 실패: 사용자 정보가 없습니다.');
    }

    const { googleId, email, displayName, accessToken, firstName } = req.user;

    // 사용자 조회
    let user = await this.userRepository.findOne({ where: { googleId } });

    const num = Math.floor(1000 + Math.random() * 9000);
    const num1 = Math.floor(1000 + Math.random() * 9000);
    if (!user) {
      // 새로운 사용자 생성
      user = this.userRepository.create({
        email,
        name: displayName,
        firstName,
        googleId,
        isSocial: true,
        nickname: displayName,
        phoneNumber: `010-${num}-${num1}`,
        accessToken: accessToken,
      });
      await this.userRepository.save(user);
    } else {
      // 기존 사용자 정보 업데이트
      user.accessToken = accessToken;
      user.firstName = firstName;
      await this.userRepository.save(user);
    }

    // JWT 발급
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      isSocial: user.isSocial,
    };

    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
