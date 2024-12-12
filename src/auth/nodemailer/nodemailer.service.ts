import { Injectable } from '@nestjs/common';
import { SendEmailDto } from './dto/create-nodemailer.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

@Injectable()
export class NodemailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(sendEmailDto: SendEmailDto, req: Request): Promise<{ message: string }> {
    try {
      const code = this.createVerificationCode();
      this.storeVerificationCode(req, code);

      await this.sendVerificationEmail(sendEmailDto.email, code);

      return { message: `${sendEmailDto.email}로 인증번호가 전송되었습니다.` };
    } catch (error) {
      throw new Error('이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  private createVerificationCode(): string {
    return uuidv4().slice(0, 6);
  }

  private storeVerificationCode(req: Request, code: string): void {
    req.session.code = code;
  }

  private async sendVerificationEmail(email: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER || 'no-reply@example.com',
      to: email,
      subject: '이메일 인증 코드',
      text: `인증번호: ${code}`,
    });
  }
}
