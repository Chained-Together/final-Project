import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from 'src/interface/hashing-interface';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BcryptHashingService } from 'src/interface/impl/bcrypt-hashing-service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<UserEntity>;
  let jwtService: JwtService;
  let hashingService: HashingService;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockHashingService = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const signUpDto = {
    email: 'test@test.com',
    password: 'password',
    confirmedPassword: 'password',
    name: 'name',
    nickname: 'nickname',
    phoneNumber: '01000000000',
  };

  const loginDTO = {
    email: 'test@test.com',
    password: 'test',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
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
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    jwtService = module.get<JwtService>(JwtService);
    hashingService = module.get<HashingService>('HashingService');
  });

  describe('회원가입', () => {
    it('회원가입 시 이메일이 중복되면 BadRequestException 반환', async () => {
      mockUserRepository.findOne.mockResolvedValue({ email: 'test@test.com' });

      await expect(authService.signUp(signUpDto)).rejects.toThrow(BadRequestException);
    });

    it('회원가입 시 비밀번호 확인이 다르면 BadRequestException 반환', async () => {
      const wrongPassword = {
        email: 'test@test.com',
        password: 'password',
        confirmedPassword: 'wrongPassword',
        name: 'name',
        nickname: 'nickname',
        phoneNumber: '01000000000',
      };

      mockUserRepository.findOne.mockResolvedValueOnce(null);

      await expect(authService.signUp(wrongPassword)).rejects.toThrow(BadRequestException);
    });

    it('회원가입 시 닉네임이 중복되면 BadRequestException 반환', async () => {
      mockUserRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValue({ nickname: 'nickname' });

      await expect(authService.signUp(signUpDto)).rejects.toThrow(BadRequestException);
    });

    it('회원가입 시 전화번호가 중복되면 BadRequestException 반환', async () => {
      mockUserRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValue({ phoneNumber: '01000000000' });

      await expect(authService.signUp(signUpDto)).rejects.toThrow(BadRequestException);
    });

    it('회원가입 성공 검증', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockHashingService.hash.mockResolvedValue('hashedPassword');

      await authService.signUp(signUpDto);

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
    it('유저가 존재하지 않으면 UnauthorizedException 반환', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(authService.logIn(loginDTO)).rejects.toThrow(UnauthorizedException);
    });

    it('비밀번호가 일치하지 않으면 UnauthorizedException 반환', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: 'test1',
      };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      mockHashingService.compare.mockResolvedValue(false);

      await expect(authService.logIn(loginDTO)).rejects.toThrow(UnauthorizedException);
    });

    it('유저가 존재하고 비밀번호가 일치하면 엑세스 토큰을 반환', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: 'test',
      };

      const mockPayload = {
        email: loginDTO.email,
        sub: mockUser.id,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      mockHashingService.compare.mockResolvedValue(true);

      mockJwtService.sign.mockReturnValue(mockPayload);

      const result = await authService.logIn(loginDTO);

      expect(result).toEqual({
        access_token: mockPayload,
      });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDTO.email },
      });

      expect(hashingService.compare).toHaveBeenCalled();
    });
  });
});
