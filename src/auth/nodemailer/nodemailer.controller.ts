import { Controller, Post, Body, Req } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { SendEmailDto } from './dto/create-nodemailer.dto';
import { Request } from 'express';

@Controller('nodemailer')
export class NodemailerController {
  constructor(private readonly nodemailerService: NodemailerService) {}

  @Post()
  async sendMail(@Body() sendEmailDto: SendEmailDto, @Req() req: Request) {
    return this.nodemailerService.sendMail(sendEmailDto, req);
  }
}
