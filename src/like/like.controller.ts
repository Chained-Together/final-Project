import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeleteResult } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { LikeEntity } from './entities/like.entity';
import { LikeService } from './like.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('좋아요 API') // Swagger 그룹 태그
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post(':videoId')
  @ApiOperation({
    summary: '좋아요 토글',
    description: '특정 동영상에 좋아요를 추가하거나 제거합니다. JWT 인증이 필요합니다.',
  })
  @ApiOkResponse({
    description: '좋아요가 성공적으로 추가되거나 제거되었습니다.',
    type: LikeEntity, // 반환되는 데이터의 타입 정의
  })
  async toggleLike(
    @Param('videoId') videoId: number,
    @Request() req,
  ): Promise<({ user: { id: number }; video: { id: number } } & LikeEntity) | DeleteResult> {
    const user = req.user as UserEntity;
    return this.likeService.toggleLike(user, videoId);
  }

  @Get(':videoId')
  @ApiOperation({
    summary: '좋아요 조회',
    description: '특정 동영상에 대한 좋아요 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '좋아요 목록이 반환됩니다.',
  })
  async getLikes(@Param('videoId') videoId: number) {
    return this.likeService.getLikes(videoId);
  }
}
