import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from 'src/interface/IUserRepository';
import { IPasswordResetTokenRepository } from 'src/interface/password-interface';
import {
  mockExpiredToken,
  mockPasswordResetToken,
  mockResetPasswordRequestDto,
  mockUpdatedUser,
  mockUpdatePasswordDto,
  mockUsedToken,
  mockUser,
} from './__mocks__/mock.password.data';
import {
  mockHashingService,
  mockMailerService,
  mockTokenRepository,
  mockUserRepository,
} from './__mocks__/mock.password.service';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let passwordService: PasswordService;
  let userRepository: IUserRepository;
  let PasswordResetTokenRepository: IPasswordResetTokenRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        {
          provide: 'IPasswordResetTokenRepository',
          useValue: mockTokenRepository,
        },
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: 'HashingService',
          useValue: mockHashingService,
        },
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    passwordService = module.get<PasswordService>(PasswordService);
    userRepository = module.get<IUserRepository>('IUserRepository');
    PasswordResetTokenRepository = module.get<IPasswordResetTokenRepository>(
      'IPasswordResetTokenRepository',
    );
  });

  describe('resetPasswordRequest', () => {
    it('사용자를 찾을 수 없으면 NotFoundException을 던져야 한다.', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        passwordService.resetPasswordRequest(mockResetPasswordRequestDto.email),
      ).rejects.toThrow(NotFoundException);
    });

    it('비밀번호 초기화 이메일을 성공적으로 보내야 한다.', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTokenRepository.saveToken.mockResolvedValue({});
      mockMailerService.sendMail.mockResolvedValue({});

      await passwordService.resetPasswordRequest(mockResetPasswordRequestDto.email);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        mockResetPasswordRequestDto.email,
      );
      expect(mockTokenRepository.saveToken).toHaveBeenCalled();
      expect(mockMailerService.sendMail).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('잘못된 토큰으로 요청 시 NotFoundException을 던져야 한다.', async () => {
      mockTokenRepository.findTokenByTokenHash.mockResolvedValue(null);

      await expect(
        passwordService.resetPassword('invalid-token', mockUpdatePasswordDto.newPassword),
      ).rejects.toThrow(NotFoundException);
    });

    it('이미 사용된 토큰으로 요청 시 BadRequestException을 던져야 한다.', async () => {
      mockTokenRepository.findTokenByTokenHash.mockResolvedValue(mockUsedToken);

      await expect(
        passwordService.resetPassword('token', mockUpdatePasswordDto.newPassword),
      ).rejects.toThrow(BadRequestException);
    });

    it('만료된 토큰으로 요청 시 BadRequestException을 던져야 한다.', async () => {
      mockTokenRepository.findTokenByTokenHash.mockResolvedValue(mockExpiredToken);

      await expect(
        passwordService.resetPassword('token', mockUpdatePasswordDto.newPassword),
      ).rejects.toThrow(BadRequestException);
    });

    it('올바른 토큰으로 요청 시 비밀번호를 업데이트하고 토큰을 사용 처리해야 한다.', async () => {
      mockTokenRepository.findTokenByTokenHash.mockResolvedValue({ ...mockPasswordResetToken });
      mockUserRepository.findUserByUserId.mockResolvedValue({ id: 1 });
      mockHashingService.hash.mockResolvedValue('hashedPassword123');

      await passwordService.resetPassword('valid-token', 'newPassword123');

      expect(mockUserRepository.save).toHaveBeenCalledWith({
        id: 1,
        password: 'hashedPassword123',
      });
      expect(mockTokenRepository.saveToken).toHaveBeenCalledWith({
        ...mockPasswordResetToken,
        used: true,
      });
    });
  });
});
