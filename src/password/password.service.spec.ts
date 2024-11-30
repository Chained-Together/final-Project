import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PasswordResetTokenEntity } from './entities/password.reset.token.entity';
import { UserEntity } from '../user/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { HashingService } from '../interface/hashing-interface';
import {
  mockHashingService,
  mockMailerService,
  mockTokenRepository,
  mockUserRepository,
} from './__mocks__/mock.password.service';
import {
  mockUser,
  mockPasswordResetToken,
  mockExpiredToken,
  mockUsedToken,
  mockResetPasswordRequestDto,
  mockUpdatePasswordDto,
  mockUpdatedUser,
} from './__mocks__/mock.password.data';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PasswordService', () => {
  let passwordService: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        {
          provide: getRepositoryToken(PasswordResetTokenEntity),
          useValue: mockTokenRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
        {
          provide: 'HashingService',
          useValue: mockHashingService,
        },
      ],
    }).compile();

    passwordService = module.get<PasswordService>(PasswordService);
  });

  describe('resetPasswordRequest', () => {
    it('사용자를 찾을 수 없으면 NotFoundException을 던져야 한다.', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        passwordService.resetPasswordRequest(mockResetPasswordRequestDto.email),
      ).rejects.toThrow(NotFoundException);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockResetPasswordRequestDto.email },
      });
    });

    it('비밀번호 초기화 이메일을 성공적으로 보내야 한다.', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockTokenRepository.save.mockResolvedValue({});
      mockMailerService.sendMail.mockResolvedValue({});

      await passwordService.resetPasswordRequest(mockResetPasswordRequestDto.email);

      expect(mockTokenRepository.save).toHaveBeenCalled();
      expect(mockMailerService.sendMail).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('잘못된 토큰으로 요청 시 NotFoundException을 던져야 한다.', async () => {
      mockTokenRepository.findOne.mockResolvedValue(null);

      await expect(
        passwordService.resetPassword('invalid-token', mockUpdatePasswordDto.newPassword),
      ).rejects.toThrow(NotFoundException);
    });

    it('이미 사용된 토큰으로 요청 시 BadRequestException을 던져야 한다.', async () => {
      mockTokenRepository.findOne.mockResolvedValue(mockUsedToken);

      await expect(
        passwordService.resetPassword('token', mockUpdatePasswordDto.newPassword),
      ).rejects.toThrow(BadRequestException);
    });

    it('만료된 토큰으로 요청 시 BadRequestException을 던져야 한다.', async () => {
      mockTokenRepository.findOne.mockResolvedValue(mockExpiredToken);

      await expect(
        passwordService.resetPassword('token', mockUpdatePasswordDto.newPassword),
      ).rejects.toThrow(BadRequestException);
    });

    it('올바른 토큰으로 요청 시 비밀번호를 업데이트하고 토큰을 사용 처리해야 한다.', async () => {
      mockTokenRepository.findOne.mockResolvedValue(mockPasswordResetToken);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockHashingService.hash.mockResolvedValue('hashedNewPassword123');

      await passwordService.resetPassword('token', mockUpdatePasswordDto.newPassword);

      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUpdatedUser);
      expect(mockTokenRepository.save).toHaveBeenCalledWith({
        ...mockPasswordResetToken,
        used: true,
      });
    });
  });
});
