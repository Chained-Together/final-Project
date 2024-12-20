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
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';
import { OptionalAuthGuard } from 'src/utils/optional-authguard';
import { UserInfo } from '../utils/user-info.decorator';
import { UpdateVideoDto } from './dto/update.video.dto';
import { VideoDto } from './dto/video.dto';
import { VideoEntity } from './entities/video.entity';
import { VideoService } from './video.service';

@ApiTags('동영상 관리 API') // Swagger 그룹 태그
@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '동영상 메타데이터 저장',
    description: '사용자가 동영상의 메타데이터를 저장합니다. JWT 인증이 필요합니다.',
  })
  @ApiOkResponse({
    description: '동영상 메타데이터가 성공적으로 저장되었습니다.',
    schema: {
      example: {
        redirectUrl: '/myChannel',
      },
    },
  })
  async saveMetadata(@UserInfo() user: UserEntity, @Body() videoDto: VideoDto) {
    console.log('Received videoDto:', videoDto);
    console.log('Received user:', user);

    await this.videoService.saveMetadata(user, videoDto);
    return { redirectUrl: '/myChannel' };
  }

  @Get()
  @ApiOperation({
    summary: '모든 동영상 조회',
    description: '모든 동영상을 조회합니다.',
  })
  @ApiOkResponse({
    description: '모든 동영상 데이터가 반환됩니다.',
  })
  getAllVideo() {
    return this.videoService.getAllVideo();
  }

  @Get('my/:channelId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '내 채널의 동영상 조회',
    description: '사용자의 채널 ID를 기준으로 동영상을 조회합니다.',
  })
  @ApiOkResponse({
    description: '내 채널의 동영상 목록이 반환됩니다.',
  })
  getAllVideoOfMyChannel(@Param('channelId') channelId: number, @UserInfo() user: UserEntity) {
    return this.videoService.getAllVideoOfMyChannel(channelId, user.id);
  }

  @Get('channel/:channelId')
  @ApiOperation({
    summary: '특정 채널의 동영상 조회',
    description: '채널 ID를 기준으로 동영상을 조회합니다.',
  })
  @ApiOkResponse({
    description: '특정 채널의 동영상 목록이 반환됩니다.',
  })
  getAllVideoOfChannel(@Param('channelId') channelId: number) {
    return this.videoService.getAllVideoOfChannel(channelId);
  }

  @Get('/:id')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({
    summary: '특정 동영상 조회',
    description: '동영상 ID와 선택적 접근 키를 사용하여 동영상을 조회합니다.',
  })
  @ApiQuery({
    name: 'accessKey',
    required: false,
    description: '동영상에 대한 접근 키',
  })
  @ApiOkResponse({
    description: '동영상 데이터가 반환됩니다.',
    type: VideoEntity,
  })
  async getVideo(
    @Param('id') id: number,
    @Query('accessKey') accessKey?: string,
    @UserInfo() user?: UserEntity,
  ): Promise<VideoEntity | object | { videoUrl: string }> {
    return this.videoService.getVideo(id, user?.id, accessKey);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '동영상 업데이트',
    description: '동영상의 메타데이터를 업데이트합니다. JWT 인증이 필요합니다.',
  })
  @ApiOkResponse({
    description: '동영상 메타데이터가 성공적으로 업데이트되었습니다.',
    type: VideoEntity,
  })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: '동영상 삭제',
    description: '동영상을 삭제합니다. JWT 인증이 필요합니다.',
  })
  @ApiOkResponse({
    description: '동영상이 성공적으로 삭제되었습니다.',
  })
  deleteVideo(@UserInfo() user: UserEntity, @Param('id') id: number): Promise<object> {
    return this.videoService.deleteVideo(user, id);
  }

  @Get('/search/:keyword')
  @ApiOperation({
    summary: '동영상 검색',
    description: '키워드를 사용하여 동영상을 검색합니다.',
  })
  @ApiOkResponse({
    description: '검색된 동영상 목록이 반환됩니다.',
  })
  findVideoByKeyword(@Param('keyword') keyword: string) {
    return this.videoService.findVideoByKeyword(keyword);
  }
}
