import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { IUserRepository } from 'src/interface/IUserRepository';
import { IPasswordResetTokenRepository } from 'src/interface/password-interface';
import { HashingService } from '../interface/hashing-interface';

@Injectable()
export class PasswordService {
  constructor(
    @Inject('IPasswordResetRepository')
    private readonly tokenRepository: IPasswordResetTokenRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('HashingService')
    private readonly bcryptHashingService: HashingService,
    private readonly mailerService: MailerService,
  ) {}

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const user = await this.userRepository.findUserByUserId(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = await this.bcryptHashingService.hash(newPassword);
    await this.userRepository.save(user);
  }

  async resetPasswordRequest(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { rawToken } = await this.generateResetToken(user.id);

    const resetLink = `${this.getLocalDomain()}/reset-password?token=${rawToken}`;
    await this.sendResetPasswordEmail(user.email, resetLink);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenRecord = await this.validateAndUseToken(token);
    await this.updatePassword(tokenRecord.userId, newPassword);
  }

  private async generateResetToken(userId: number): Promise<{ rawToken: string; token: any }> {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const token = this.tokenRepository.createToken(userId, tokenHash, expiresAt);
    await this.tokenRepository.saveToken(token);

    return { rawToken, token };
  }

  private async validateAndUseToken(token: string): Promise<any> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const tokenRecord = await this.tokenRepository.findTokenByTokenHash(tokenHash);

    if (!tokenRecord) {
      throw new NotFoundException('Invalid token');
    }

    if (tokenRecord.used) {
      throw new BadRequestException('Token already used');
    }

    if (new Date() > tokenRecord.expiresAt) {
      throw new BadRequestException('Token expired');
    }

    tokenRecord.used = true;
    await this.tokenRepository.saveToken(tokenRecord);

    return tokenRecord;
  }

  private getLocalDomain(): string {
    return `http://localhost:${process.env.PORT}`;
  }

  private async sendResetPasswordEmail(email: string, resetLink: string): Promise<void> {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset your password',
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });
  }
}
