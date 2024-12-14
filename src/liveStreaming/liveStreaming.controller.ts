import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LiveStreamingDto } from './dto/create.liveStreaming';
import { LiveStreamingService } from './liveStreaming.service';
import { UserInfo } from 'src/utils/user-info.decorator';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('liveStreaming')
export class LiveStreamingController {
  constructor(private readonly liveStreamingService: LiveStreamingService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createLiveStreaming(
    @UserInfo() user: UserEntity,
    @Body() liveStreamingDto: LiveStreamingDto,
  ) {
    return this.liveStreamingService.createLiveStreaming(user.id, liveStreamingDto);
  }
}
