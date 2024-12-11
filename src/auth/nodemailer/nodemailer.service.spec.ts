import { Test, TestingModule } from '@nestjs/testing';
import { NodemailerService } from './nodemailer.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Request } from 'express';
import { sendEmailDto } from './__mocks__/mock.nodemailer.data';
import { mockMailerService } from './__mocks__/mock.nodemailer.service';

describe('NodemailerService', () => {
  let nodemailerService: NodemailerService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NodemailerService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    nodemailerService = module.get<NodemailerService>(NodemailerService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('서비스가 정의되어 있어야 한다.', () => {
    expect(nodemailerService).toBeDefined();
  });

  describe('sendMail', () => {
    it('이메일 인증 코드를 성공적으로 전송해야 한다.', async () => {
      const mockRequest = { session: {} } as Request;

      mockMailerService.sendMail.mockResolvedValue({});

      const result = await nodemailerService.sendMail(sendEmailDto, mockRequest);

      expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_USER || 'no-reply@example.com',
        to: sendEmailDto.email,
        subject: '이메일 인증 코드',
        text: expect.stringMatching(/^인증번호: \w{6}$/),
      });

      expect(mockRequest.session.code).toHaveLength(6);
      expect(result).toEqual({
        message: `${sendEmailDto.email}로 인증번호가 전송되었습니다.`,
      });
    });

    it('이메일 전송 실패 시 예외를 던져야 한다.', async () => {
      const mockRequest = { session: {} } as Request;

      mockMailerService.sendMail.mockRejectedValue(
        new Error('이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.'),
      );

      await expect(nodemailerService.sendMail(sendEmailDto, mockRequest)).rejects.toThrow(
        '이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_USER || 'no-reply@example.com',
        to: sendEmailDto.email, // 올바른 to 값
        subject: '이메일 인증 코드',
        text: expect.stringMatching(/^인증번호: \w{6}$/),
      });
    });
  });

  describe('createVerificationCode', () => {
    it('6자리 인증 코드를 생성해야 한다.', () => {
      const code = nodemailerService['createVerificationCode']();
      expect(code).toHaveLength(6);
      expect(typeof code).toBe('string');
    });
  });
});
