import { Test, TestingModule } from '@nestjs/testing';
import { NodemailerController } from './nodemailer.controller';
import { NodemailerService } from './nodemailer.service';
import { SendEmailDto } from './dto/create-nodemailer.dto';

describe('NodemailerController', () => {
  let nodeMailerController: NodemailerController;
  let nodeMailerService: NodemailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodemailerController],
      providers: [
        {
          provide: NodemailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    nodeMailerController = module.get<NodemailerController>(NodemailerController);
    nodeMailerService = module.get<NodemailerService>(NodemailerService);
  });

  describe('sendMail', () => {
    it('이메일 입력하면 전송한다.', async () => {
      const sendEmailDto: SendEmailDto = {
        email: 'test@test.com',
      };
      const req: any = {
        session: {},
      };
      await nodeMailerController.sendMail(sendEmailDto, req);
      expect(nodeMailerService.sendMail).toHaveBeenCalledWith(sendEmailDto, req);
    });
  });
});
