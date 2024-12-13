import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/user-info.decorator';
import { ObsService } from './obs.service';

@Controller('obs')
export class ObsController {
  constructor(private readonly obsService: ObsService) {}

  @Get('streamKey')
  @UseGuards(AuthGuard('jwt'))
  getUserStreamKey(@UserInfo() user: UserEntity) {
    return this.obsService.getUserStreamKey(user.id);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyStreamKey(@Body() body: { name: string }) {
    const { name } = body;

    const isValid = await this.obsService.verifyStreamKey(name);

    if (!isValid) {
      throw new Error('Unauthorized');
    }

    return 'OK';
  }

  @Post('stream_done')
  @HttpCode(HttpStatus.OK)
  async streamDone(@Body() body: { name: string }) {
    const { name } = body;
    console.log('방송이 종료되었습니다. 스트림 키:', name);
    await this.obsService.handleStreamDone(name);
    return 'OK';
  }
}
