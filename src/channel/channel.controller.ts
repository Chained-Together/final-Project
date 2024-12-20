import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChannelService } from './channel.service';
import { ChannelDto } from './dto/channel.dto';
import { ChannelEntity } from './entities/channel.entity';

import { Response } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/user-info.decorator';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createChannel(@Body() channelDto: ChannelDto, user: UserEntity, @Res() res: Response) {
    await this.channelService.createChannel(channelDto, user);
    return res.redirect('/');
  }

  @Get('/:channelId')
  getChannel(@Param('channelId') id: number): Promise<ChannelEntity> {
    return this.channelService.getChannel(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getMyChannel(@UserInfo() user: UserEntity): Promise<ChannelEntity> {
    return this.channelService.getMyChannel(user);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  async updateChannel(
    @UserInfo() user: UserEntity,
    @Body() channelDto: ChannelDto,
  ): Promise<ChannelEntity> {
    return this.channelService.updateChannel(user, channelDto);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async removeChannel(@UserInfo() user: UserEntity): Promise<ChannelEntity> {
    return this.channelService.removeChannel(user);
  }

  @Get('/search/:keyword')
  findChannelByKeyword(@Param('keyword') keyword: string) {
    return this.channelService.findChannelByKeyword(keyword);
  }

  @Get('/video/:videoId')
  async getUserChannel(@Param('videoId') videoId: number): Promise<ChannelEntity> {
    console.log('요청 받음');
    return this.channelService.getUserChannel(videoId);
  }
}
