import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../user/entity/user.entity';
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
  async saveMetadata(@UserInfo() user: UserEntity, @Body() videoDto: VideoDto): Promise<object> {
    console.log('Received videoDto:', videoDto);
    console.log('Received user:', user);

    return this.videoService.saveMetadata(user, videoDto);
  }

  @Get()
  getAllVideo() {
    return this.videoService.getAllVideo();
  }

  @Get('my/:channelId')
  getAllVideoOfChannel(@Param('channelId') channelId: number) {
    // console.log(channelId);
    return this.videoService.getAllVideoOfChannel(channelId);
  }

  @Get('/:id')
  getVideo(@Param('id') id: number): Promise<VideoEntity> {
    return this.videoService.getVideo(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  updateVideo(
    @UserInfo() user: UserEntity,
    @Param('id') id: number,
    @Body() updateVideoDto: UpdateVideoDto,
  ): Promise<VideoEntity> {
    return this.videoService.updateVideo(user, id, updateVideoDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteVideo(@UserInfo() user: UserEntity, @Param('id') id: number): Promise<object> {
    return this.videoService.deleteVideo(user, id);
  }
}
