import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from 'src/interface/hashing-interface';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { SignUpDto } from './dto/signUp.dto';
import {
  mockChannelService,
  mockHashingService,
  mockJwtService,
  mockUserRepository,
} from './__mocks__/mock.auth.service';
import {
  loginDTO,
  mockPayload,
  mockRequest,
  mockUser,
  signUpDto,
  wrongPassword,
} from './__mocks__/mock.auth.data';
import { IUserRepository } from 'src/interface/IUserRepository';
import { ChannelService } from 'src/channel/channel.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let hashingService: HashingService;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: 'HashingService',
          useValue: mockHashingService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ChannelService,
          useValue: mockChannelService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    hashingService = module.get<HashingService>('HashingService');
    userRepository = module.get<IUserRepository>('IUserRepository');
  });

  describe('회원가입', () => {
    it('회원가입 시 인증번호가 일치하지 않으면 BadRequestException 던짐', async () => {
      await expect(authService.signUp(signUpDto, mockRequest)).rejects.toThrow(BadRequestException);
    });

    it('회원가입 시 이메일이 중복되면 BadRequestException 던짐', async () => {
      mockRequest.session.code = '1234';
      mockUserRepository.findByEmail.mockResolvedValue({ email: signUpDto.email });
      mockUserRepository.findByNickname.mockResolvedValue(null);
      mockUserRepository.findByPhoneNumber.mockResolvedValue(null);

      await expect(authService.signUp(signUpDto, mockRequest)).rejects.toThrow(BadRequestException);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(signUpDto.email);
    });

    it('회원가입 시 비밀번호 확인이 다르면 BadRequestException 던짐', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.signUp(wrongPassword, mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('회원가입 시 닉네임이 중복되면 BadRequestException 던짐', async () => {
      mockUserRepository.findByNickname.mockResolvedValue({ nickname: 'nickname' });

      await expect(authService.signUp(signUpDto, mockRequest)).rejects.toThrow(BadRequestException);

      expect(mockUserRepository.findByNickname).toHaveBeenCalledWith(signUpDto.nickname);
    });

    it('회원가입 시 전화번호가 중복되면 BadRequestException 던짐', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByNickname.mockResolvedValue(null);
      mockUserRepository.findByPhoneNumber.mockResolvedValue({ phoneNumber: '01000000000' });

      await expect(authService.signUp(signUpDto, mockRequest)).rejects.toThrow(BadRequestException);

      expect(mockUserRepository.findByPhoneNumber).toHaveBeenCalledWith(signUpDto.phoneNumber);
    });

    it('회원가입 성공 검증', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByNickname.mockResolvedValue(null);
      mockUserRepository.findByPhoneNumber.mockResolvedValue(null);
      mockHashingService.hash.mockResolvedValue('hashedPassword');

      const result = await authService.signUp(signUpDto, mockRequest);

      expect(result).toEqual({
        message: '회원가입에 성공했습니다.',
      });
      expect(mockHashingService.hash).toHaveBeenCalledWith(signUpDto.password);
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        email: signUpDto.email,
        password: 'hashedPassword',
        name: signUpDto.name,
        nickname: signUpDto.nickname,
        phoneNumber: signUpDto.phoneNumber,
      });
    });
  });

  describe('login', () => {
    it('유저가 존재하지 않으면 UnauthorizedException 던짐', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.logIn(loginDTO)).rejects.toThrow(UnauthorizedException);
    });

    it('비밀번호가 일치하지 않으면 UnauthorizedException 던짐', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      mockHashingService.compare.mockResolvedValue(false);

      await expect(authService.logIn(loginDTO)).rejects.toThrow(UnauthorizedException);
    });

    it('유저가 존재하고 비밀번호가 일치하면 엑세스 토큰을 던짐', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      mockHashingService.compare.mockResolvedValue(true);

      mockJwtService.sign.mockReturnValue(mockPayload);

      const result = await authService.logIn(loginDTO);

      expect(result).toEqual({
        access_token: mockPayload,
      });

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginDTO.email);

      expect(hashingService.compare).toHaveBeenCalled();
    });
  });
});
