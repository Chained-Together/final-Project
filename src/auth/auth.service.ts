import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from 'src/interface/hashing-interface';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signUp.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { Request } from 'express';
import { IUserRepository } from 'src/interface/IUserRepository';
import { ChannelService } from 'src/channel/channel.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    @Inject('HashingService')
    private readonly bcryptHashingService: HashingService,
    private readonly channelService: ChannelService,
  ) {}

  async signUp(signUpDto: SignUpDto, req: Request) {
    await this.verifyCode(signUpDto.code, req);
    await this.validateUserUniqueness(signUpDto);

    this.validatePasswords(signUpDto.password, signUpDto.confirmedPassword);

    const hashedPassword = await this.bcryptHashingService.hash(signUpDto.password);

    const newUser = await this.userRepository.save({
      email: signUpDto.email,
      password: hashedPassword,
      name: signUpDto.name,
      nickname: signUpDto.nickname,
      phoneNumber: signUpDto.phoneNumber,
    });

    await this.createChannel(signUpDto.nickname, newUser);

    return {
      message: '회원가입에 성공했습니다.',
    };
  }

  async logIn(loginDto: LoginDto) {
    const findUser = await this.userRepository.findByEmail(loginDto.email);

    if (!findUser) {
      throw new UnauthorizedException('존재하지 않는 사용자 입니다. 회원 가입을 진행해 주세요.');
    }

    if (!(await this.bcryptHashingService.compare(loginDto.password, findUser.password))) {
      throw new UnauthorizedException('비밀 번호가 일치 하지 않습니다.');
    }

    return this.generateToken(findUser);
  }

  async googleLogin(req: any): Promise<{ access_token: string }> {
    if (!req.user) {
      throw new Error('구글 인증 실패: 사용자 정보가 없습니다.');
    }

    const { googleId, email, displayName } = req.user;

    // 사용자 조회
    let user = await this.userRepository.findByGoogleId(googleId);

    const num = Math.floor(1000 + Math.random() * 9000);
    const num1 = Math.floor(1000 + Math.random() * 9000);
    if (!user) {
      // 새로운 사용자 생성
      await this.validateUserUniqueness(email);
      user = this.userRepository.createByGoogleId(email, displayName, googleId, num, num1);
      await this.userRepository.save(user);
      await this.createChannel(user.nickname, user);
    } else {
      await this.userRepository.save(user);
    }

    return this.generateToken(user);
  }
  async naverLogin(req: any): Promise<{ access_token: string }> {
    if (!req.user) {
      throw new Error('네이버 인증 실패: 사용자 정보가 없습니다.');
    }

    const { naverId, email, nickname } = req.user;

    let user = await this.userRepository.findByNaverId(naverId);

    const num = Math.floor(1000 + Math.random() * 9000);
    const num1 = Math.floor(1000 + Math.random() * 9000);
    if (!user) {
      await this.validateUserUniqueness(email);
      user = this.userRepository.createByNaverId(email, nickname, naverId, num, num1);
      await this.userRepository.save(user);
    } else {
      user.email = email;
      user.nickname = nickname;
      await this.userRepository.save(user);
    }

    return this.generateToken(user);
  }

  private async verifyCode(code: string, req: Request): Promise<void> {
    if (code !== req.session.code) {
      throw new BadRequestException('인증 코드가 일치하지 않습니다.');
    }
  }

  private async validateUserUniqueness(signUpDto: Partial<SignUpDto>): Promise<void> {
    const { email, nickname, phoneNumber } = signUpDto;

    if (await this.userRepository.findByEmail(email)) {
      throw new BadRequestException('이미 사용중인 이메일입니다.');
    }
    if (await this.userRepository.findByNickname(nickname)) {
      throw new BadRequestException('이미 사용중인 닉네임입니다.');
    }
    if (await this.userRepository.findByPhoneNumber(phoneNumber)) {
      throw new BadRequestException('이미 사용중인 전화번호입니다.');
    }
  }

  private validatePasswords(password: string, confirmedPassword: string): void {
    if (password !== confirmedPassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }
  }

  private generateToken(user: UserEntity): { access_token: string } {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      isSocial: user.isSocial,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  private async createChannel(name, user) {
    const channel = {
      name: name,
    };
    this.channelService.createChannel(channel, user);
  }
}
