import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelDto } from './dto/channel.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChannelEntity } from './entities/channel.entity';
import { User } from 'src/user/entity/user.entity';
import { UserInfo } from 'src/utils/user-info.decorator';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createChannel(
    @Body() channelDto: ChannelDto,
    @UserInfo() user: User,
  ): Promise<ChannelEntity> {
    return await this.channelService.createChannel(channelDto, user);
  }

  @Get('/:channelId')
  getChannel(@Param('channelId') id: number): Promise<ChannelEntity> {
    return this.channelService.getChannel(id);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  async updateChannel(
    @UserInfo() user: User,
    @Body() channelDto: ChannelDto,
  ): Promise<ChannelEntity> {
    return this.channelService.updateChannel(user, channelDto);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async removeChannel(@UserInfo() user: User): Promise<ChannelEntity> {
    return this.channelService.removeChannel(user);
  }
}
