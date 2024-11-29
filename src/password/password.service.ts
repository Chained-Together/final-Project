import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { PasswordResetTokenEntity } from './entities/password.reset.token.entity';
import { NodemailerService } from '../auth/nodemailer/nodemailer.service';
import { UserEntity } from '../user/entities/user.entity';
import { HashingService } from '../interface/hashing-interface';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(PasswordResetTokenEntity)
    private readonly tokenRepository: Repository<PasswordResetTokenEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject('HashingService')
    private readonly bcryptHashingService: HashingService,
    private readonly mailerService: MailerService,
  ) {}

  // 비밀번호 변경
  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = await this.bcryptHashingService.hash(newPassword);
    await this.userRepository.save(user);
  }

  // 비밀번호 초기화 요청
  async resetPasswordRequest(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    console.log(user.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 토큰 생성
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.tokenRepository.save({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    // 이메일 전송
    const LOCAL_DOMAIN = `http://localhost:${process.env.PORT}`;
    const resetLink = `${LOCAL_DOMAIN}/reset-password?token=${rawToken}`;
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Reset your password',
      text: `Click the link to reset your password:${resetLink}`,
      html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`, // HTML 형식
      // to: user.email,
      // 'Reset your password',
      // `Click the link to reset your password: ${resetLink}`,
    });
  }

  // 토큰 검증 및 비밀번호 변경
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const tokenRecord = await this.tokenRepository.findOne({
      where: { tokenHash },
    });

    if (!tokenRecord) {
      throw new NotFoundException('Invalid token');
    }

    if (tokenRecord.used) {
      throw new BadRequestException('Token already used');
    }

    if (new Date() > tokenRecord.expiresAt) {
      throw new BadRequestException('Token expired');
    }

    await this.updatePassword(tokenRecord.userId, newPassword);

    // 토큰 사용 완료 처리
    tokenRecord.used = true;
    await this.tokenRepository.save(tokenRecord);
  }
}
