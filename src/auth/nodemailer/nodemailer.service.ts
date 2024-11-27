import { Injectable } from '@nestjs/common';
import { SendEmailDto } from './dto/create-nodemailer.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

@Injectable()
export class NodemailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(sendEmailDto: SendEmailDto, req: Request) {
    const code = this.createVerificationCode();
    req.session.code = code;

    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: sendEmailDto.email,
      subject: '이메일 인증 코드',
      text: `인증번호 : ${code}`,
    });

    return { message: `${sendEmailDto.email}로 인증번호가 전송되었습니다.` };
  }

  private createVerificationCode() {
    return uuidv4().slice(0, 6);
  }
}
