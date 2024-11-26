import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Redirect,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelDto } from './dto/channel.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChannelEntity } from './entities/channel.entity';

import { UserInfo } from 'src/utils/user-info.decorator';
import { Response } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createChannel(
    @Body() channelDto: ChannelDto,
    @UserInfo() user: UserEntity,
    @Res() res: Response,
  ) {
    await this.channelService.createChannel(channelDto, user);
    // return { success: true, redirectUrl: '/channel/main' };
    // res.setHeader('X-Redirect-URL', '/channel/main');
    // return res.status(200).json({ success: true });

    return res.redirect('/main');
  }
  // @Get('/main')
  // @Render('main')
  // @UseGuards(AuthGuard('jwt'))
  // renderMain(@UserInfo() user: UserEntity) {
  //   console.log('여기로 들어오나? 들어와라잉');
  //   return { user };
  // }

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
}
