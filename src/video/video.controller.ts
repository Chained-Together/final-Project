import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../user/entity/user.entity';
import { UserInfo } from '../utils/user-info.decorator';
import { VideoDto } from './dto/video.dto';
import { VideoEntity } from './entities/video.entity';
import { VideoService } from './video.service';
import { UpdateVideoDto } from './dto/update.video.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.option';

@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file',multerOptions))
  async createVideo(
    @UserInfo() user: UserEntity,
    @Body() videoDto: VideoDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<VideoEntity> {
    console.log(file);
    return this.videoService.createVideo(user, videoDto, file);
  }

  @Get()
  getAllVideo() {
    return this.videoService.getAllVideo();
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
