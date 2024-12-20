import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/user-info.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('댓글 API') // Swagger 그룹 태그
@Controller('videos/:videoId/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '댓글 작성',
    description: '특정 동영상에 댓글을 작성합니다. JWT 인증이 필요합니다.',
  })
  @ApiOkResponse({
    description: '댓글이 성공적으로 작성되었습니다.',
  })
  createComment(
    @Param('videoId') videoId: number,
    @UserInfo() user: UserEntity,
    @Body() commentDto: CommentDto,
  ) {
    return this.commentService.createComment(commentDto, user, videoId);
  }

  @Get()
  @ApiOperation({
    summary: '댓글 목록 조회',
    description: '특정 동영상의 모든 댓글을 조회합니다.',
  })
  @ApiOkResponse({
    description: '댓글 목록이 반환됩니다.',
  })
  findAll(@Param('videoId') videoId: number) {
    return this.commentService.findAll(videoId);
  }

  @Get('/:commentId')
  @ApiOperation({
    summary: '특정 댓글 조회',
    description: '특정 동영상에서 댓글 ID를 기준으로 댓글을 조회합니다.',
  })
  @ApiOkResponse({
    description: '댓글 정보가 반환됩니다.',
  })
  findOne(@Param('videoId') videoId: number, @Param('commentId') commentId: number) {
    return this.commentService.findOne(videoId, commentId);
  }

  @Put('/:commentId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '댓글 수정',
    description: '특정 동영상에서 사용자가 작성한 댓글을 수정합니다. JWT 인증이 필요합니다.',
  })
  @ApiOkResponse({
    description: '댓글이 성공적으로 수정되었습니다.',
  })
  updateComment(
    @Param('videoId') videoId: number,
    @Param('commentId') commentId: number,
    @Body() commentDto: CommentDto,
    @UserInfo() user: UserEntity,
  ) {
    return this.commentService.updateComment(videoId, commentId, commentDto, user);
  }

  @Delete('/:commentId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '댓글 삭제',
    description: '특정 동영상에서 사용자가 작성한 댓글을 삭제합니다. JWT 인증이 필요합니다.',
  })
  @ApiOkResponse({
    description: '댓글이 성공적으로 삭제되었습니다.',
  })
  removeComment(
    @Param('videoId') videoId: number,
    @Param('commentId') commentId: number,
    @UserInfo() user: UserEntity,
  ) {
    return this.commentService.removeComment(videoId, commentId, user);
  }

  @Post('/:commentId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '답글 작성',
    description: '특정 댓글에 대한 답글을 작성합니다. JWT 인증이 필요합니다.',
  })
  @ApiOkResponse({
    description: '답글이 성공적으로 작성되었습니다.',
  })
  createReply(
    @Param('videoId') videoId: number,
    @Param('commentId') commentId: number,
    @UserInfo() user: UserEntity,
    @Body() commentDto: CommentDto,
  ) {
    return this.commentService.createReply(videoId, commentId, user, commentDto);
  }
}
