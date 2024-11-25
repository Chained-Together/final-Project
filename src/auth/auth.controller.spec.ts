import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';

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
      };

      await authController.singUp(signUpDto);

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
      };

      mockAuthService.logIn.mockResolvedValue({ access_token: 'access_token' });

      await mockAuthService.logIn(loginDto, mockResponse);

      expect(authService.logIn).toHaveBeenCalledWith(loginDto, {"setHeader": ""});
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Authorization', 'access_token');
    });
  });
});
