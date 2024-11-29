import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Request } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    logIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('회원가입', () => {
    it('회원가입 메서드 검증', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@test.com',
        password: 'password',
        confirmedPassword: 'password',
        name: 'name',
        nickname: 'nickname',
        phoneNumber: '01000000000',
        code: '1234',
      };

      // Request 객체 모킹
      const mockRequest: Partial<Request> = {
        headers: {
          authorization: 'Bearer mockToken',
        },
        body: signUpDto,
      };

      await authController.singUp(signUpDto, mockRequest as Request);

      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });

  describe('로그인', () => {
    it('로그인 메서드 검증', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'password',
      };

      const mockResponse = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockAuthService.logIn.mockResolvedValue({ access_token: 'access_token' });

      await authController.logIn(loginDto, mockResponse);

      expect(authService.logIn).toHaveBeenCalledWith(loginDto);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Authorization', 'access_token');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: '로그인 성공' });
    });
  });
});
