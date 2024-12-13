import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeleteResult } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { LikeEntity } from './entities/like.entity';
import { LikeService } from './like.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':videoId')
  async toggleLike(
    @Param('videoId') videoId: number,
    @Request() req,
  ): Promise<({ user: { id: number }; video: { id: number } } & LikeEntity) | DeleteResult> {
    const user = req.user as UserEntity;
    const userId = user.id;

    return this.likeService.toggleLike(userId, videoId);
  }

  @Get(':videoId')
  async getLikes(@Param('videoId') videoId: number) {
    return this.likeService.getLikes(videoId);
  }
}
