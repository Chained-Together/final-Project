import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entity/user.entity';
import { UserInfo } from 'src/utils/user-info.decorator';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';

@Controller('videos/:videoId/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createComment(
    @Param('videoId') videoId: number,
    @UserInfo() user: User,
    @Body() commentDto: CommentDto,
  ) {
    return this.commentService.createComment(commentDto, user, videoId);
  }

  @Get()
  findAll(@Param('videoId') videoId: number) {
    return this.commentService.findAll(videoId);
  }

  @Get('/:commentId')
  findOne(@Param('videoId') videoId: number, @Param('commentId') commentId: number) {
    return this.commentService.findOne(videoId, commentId);
  }

  @Put('/:commentId')
  @UseGuards(AuthGuard('jwt'))
  updateComment(
    @Param('videoId') videoId: number,
    @Param('commentId') commentId: number,
    @Body() commentDto: CommentDto,
    @UserInfo() user: User,
  ) {
    return this.commentService.updateComment(videoId, commentId, user, commentDto);
  }

  @Delete('/:commentId')
  @UseGuards(AuthGuard('jwt'))
  deleteComment(
    @Param('videoId') videoId: number,
    @Param('commentId') commentId: number,
    @UserInfo() user: User,
  ) {
    return this.commentService.removeComment(videoId, commentId, user);
  }
}
