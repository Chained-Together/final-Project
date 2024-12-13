import { Test, TestingModule } from '@nestjs/testing';
import { mockResetPasswordRequestDto, mockUpdatePasswordDto } from './__mocks__/mock.password.data';
import { mockPasswordService } from './__mocks__/mock.password.service';
import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';

describe('PasswordController', () => {
  let passwordController: PasswordController;
  let passwordService: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordController],
      providers: [
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    passwordController = module.get<PasswordController>(PasswordController);
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('컨트롤러가 정의되어야 한다.', () => {
    expect(passwordController).toBeDefined();
  });

  describe('resetPasswordRequest', () => {
    it('비밀번호 초기화 요청을 성공적으로 처리해야 한다.', async () => {
      mockPasswordService.resetPasswordRequest.mockResolvedValue(undefined);

      await expect(
        passwordController.resetPasswordRequest(mockResetPasswordRequestDto),
      ).resolves.toBeUndefined();

      expect(passwordService.resetPasswordRequest).toHaveBeenCalledWith(
        mockResetPasswordRequestDto.email,
      );
    });
  });

  describe('updatePassword', () => {
    it('비밀번호를 성공적으로 변경해야 한다.', async () => {
      mockPasswordService.resetPassword.mockResolvedValue(undefined);

      const result = await passwordController.updatePassword('valid-token', mockUpdatePasswordDto);

      expect(result).toEqual('Password successfully reset');
      expect(passwordService.resetPassword).toHaveBeenCalledWith(
        'valid-token',
        mockUpdatePasswordDto.newPassword,
      );
    });
  });
});
