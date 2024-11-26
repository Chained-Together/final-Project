import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../user/entity/user.entity';
import { UserInfo } from '../utils/user-info.decorator';
import { UpdateVideoDto } from './dto/update.video.dto';
import { VideoDto } from './dto/video.dto';
import { VideoEntity } from './entities/video.entity';
import { VideoService } from './video.service';
import { OptionalAuthGuard } from 'src/utils/optional-authguard';

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
  ): Promise<VideoEntity> {
    return this.videoService.getVideo(id, user?.id, accessKey);
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
