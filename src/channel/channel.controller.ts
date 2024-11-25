import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelDto } from './dto/channel.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChannelEntity } from './entities/channel.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserInfo } from 'src/utils/user-info.decorator';
import { Response } from 'express';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createChannel(
    @Body() channelDto: ChannelDto,
    @UserInfo() user: UserEntity,
    // @Res() res: Response,
  ) {
    return this.channelService.createChannel(channelDto, user);
    // return res.redirect('main');
  }

  // @Get('main')
  // renderMain(@Res() res: Response) {
  //   res.render('main');
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
