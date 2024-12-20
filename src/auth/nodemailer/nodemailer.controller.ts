import { Controller, Post, Body, Req } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { SendEmailDto } from './dto/create-nodemailer.dto';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@Controller('nodemailer')
@ApiTags('이메일 전송 API')
export class NodemailerController {
  constructor(private readonly nodemailerService: NodemailerService) {}

  @Post()
  @ApiOperation({
    summary: '이메일 전송',
    description:
      '지정된 수신자 이메일로 메일을 전송합니다. 본문과 제목을 포함한 이메일 데이터를 입력합니다.',
  })
  @ApiOkResponse({
    description: '이메일이 성공적으로 전송되었습니다.',
  })
  async sendMail(@Body() sendEmailDto: SendEmailDto, @Req() req: Request) {
    return this.nodemailerService.sendMail(sendEmailDto, req);
  }
}
