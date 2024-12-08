import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/entities/user.entity';
import { OptionalAuthGuard } from 'src/utils/optional-authguard';
import { UserInfo } from '../utils/user-info.decorator';
import { UpdateVideoDto } from './dto/update.video.dto';
import { VideoDto } from './dto/video.dto';
import { VideoEntity } from './entities/video.entity';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async saveMetadata(@UserInfo() user: UserEntity, @Body() videoDto: VideoDto) {
    console.log('Received videoDto:', videoDto);
    console.log('Received user:', user);

    await this.videoService.saveMetadata(user, videoDto);
    return { redirectUrl: '/myChannel' };
  }

  @Get()
  getAllVideo() {
    return this.videoService.getAllVideo();
  }

  @Get('my/:channelId')
  getAllVideoOfChannel(@Param('channelId') channelId: number) {
    console.log('요청 받음');
    return this.videoService.getAllVideoOfChannel(channelId);
  }

  @Get('edit/:channelId')
  @UseGuards(AuthGuard('jwt'))
  getAllVideoOfMYChannel(@Param('channelId') channelId: number, @UserInfo() user: UserEntity) {
    return this.videoService.getAllVideoOfMyChannel(channelId, user.id);
  }

  @Get('/:id')
  @UseGuards(OptionalAuthGuard)
  async getVideo(
    @Param('id') id: number,
    @Query('accessKey') accessKey?: string,
    @UserInfo() user?: UserEntity,
  ): Promise<VideoEntity | object | { videoUrl: string }> {
    return this.videoService.getVideo(id, user?.id, accessKey);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  updateVideo(
    @UserInfo() user: UserEntity,
    @Param('id') id: number,
    @Body() updateVideoDto: UpdateVideoDto,
  ): Promise<VideoEntity> {
    console.log('요청 받음');
    return this.videoService.updateVideo(user, id, updateVideoDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteVideo(@UserInfo() user: UserEntity, @Param('id') id: number): Promise<object> {
    return this.videoService.deleteVideo(user, id);
  }

  @Get('/many/:lastId/:take')
  getNewVideos(
    @Param('lastId', ParseIntPipe) lastId: number,
    @Param('take', ParseIntPipe) take: number,
  ) {
    const validTakeValues = [6, 12];

    if (!validTakeValues.includes(take)) {
      throw new BadRequestException('유효한 take 값은 6 또는 12만 가능합니다.');
    }

    return this.videoService.getNewVideos(lastId, take);
  }

  @Get('/link/:id')
  @UseGuards(OptionalAuthGuard)
  getVideoLink(@Param('id') id: number) {
    return this.videoService.getVideoLink(id);
  }

  @Get('/search/:keyword')
  findVideoByKeyword(@Param('keyword') keyword: string) {
    return this.videoService.findVideoByKeyword(keyword);
  }
}
