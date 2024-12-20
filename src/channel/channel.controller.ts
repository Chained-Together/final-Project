import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChannelService } from './channel.service';
import { ChannelDto } from './dto/channel.dto';
import { ChannelEntity } from './entities/channel.entity';
import { Response } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/user-info.decorator';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('채널 API')
@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '채널 생성',
    description: '사용자가 새로운 채널을 생성합니다. JWT 인증이 필요합니다.',
  })
  @ApiOkResponse({
    description: '채널이 성공적으로 생성되었습니다.',
  })
  async createChannel(@Body() channelDto: ChannelDto, user: UserEntity, @Res() res: Response) {
    await this.channelService.createChannel(channelDto, user);
    return res.redirect('/');
  }

  @Get('/:channelId')
  @ApiOperation({
    summary: '채널 조회',
    description: '특정 채널의 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '채널 정보가 반환됩니다.',
    type: ChannelEntity,
  })
  getChannel(@Param('channelId') id: number): Promise<ChannelEntity> {
    return this.channelService.getChannel(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '내 채널 조회',
    description: '현재 로그인된 사용자의 채널 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '사용자의 채널 정보가 반환됩니다.',
    type: ChannelEntity,
  })
  getMyChannel(@UserInfo() user: UserEntity): Promise<ChannelEntity> {
    return this.channelService.getMyChannel(user);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '채널 업데이트',
    description: '현재 사용자가 소유한 채널의 정보를 수정합니다. JWT 인증이 필요합니다.',
  })
  @ApiOkResponse({
    description: '채널이 성공적으로 업데이트되었습니다.',
    type: ChannelEntity,
  })
  async updateChannel(
    @UserInfo() user: UserEntity,
    @Body() channelDto: ChannelDto,
  ): Promise<ChannelEntity> {
    return this.channelService.updateChannel(user, channelDto);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '채널 삭제',
    description: '현재 사용자가 소유한 채널을 삭제합니다. JWT 인증이 필요합니다.',
  })
  @ApiOkResponse({
    description: '채널이 성공적으로 삭제되었습니다.',
    type: ChannelEntity,
  })
  async removeChannel(@UserInfo() user: UserEntity): Promise<ChannelEntity> {
    return this.channelService.removeChannel(user);
  }

  @Get('/search/:keyword')
  @ApiOperation({
    summary: '채널 검색',
    description: '키워드를 사용하여 채널을 검색합니다.',
  })
  @ApiOkResponse({
    description: '검색된 채널 목록이 반환됩니다.',
  })
  findChannelByKeyword(@Param('keyword') keyword: string) {
    return this.channelService.findChannelByKeyword(keyword);
  }
}
