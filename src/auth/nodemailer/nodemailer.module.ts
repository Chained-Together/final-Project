import { Module } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { NodemailerController } from './nodemailer.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            user: process.env.EMAILADDRESS,
            pass: process.env.EMAILPASSWORD,
          },
        },
        defaults: {
          from: `'인증번호' <${process.env.EMAILADDRESS}>`,
        },
      }),
    }),
  ],
  controllers: [NodemailerController],
  providers: [NodemailerService],
})
export class NodemailerModule {}
