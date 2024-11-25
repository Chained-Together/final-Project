import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteResult } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { LikeEntity } from './entities/like.entity';
import { LikeService } from './like.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':videoId')
  async toggleLike(
    @Param('videoId') videoId: number,
    @Req() req: Request,
  ): Promise<({ user: { id: number }; video: { id: number } } & LikeEntity) | DeleteResult> {
    const user = req.user as UserEntity;
    const userId = user.id;

    return this.likeService.toggleLike(userId, videoId);
    //TODO:트라이캐치사용 ??
    // try {
    //   return await this.likeService.toggleLike(videoId, userId);
    // } catch (error) {
    //   throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    // }
  }

  @Get(':videoId')
  async getLikes(@Param('videoId') videoId: number) {
    return this.likeService.getLikes(videoId);
  }
}
