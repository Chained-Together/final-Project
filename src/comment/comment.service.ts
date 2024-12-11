import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import _ from 'lodash';
import { ICommentRepository } from 'src/interface/comment-interface';
import { IVideoRepository } from 'src/interface/video-interface';
import { NotificationService } from 'src/notification/notification.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { CommentDto } from './dto/comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @Inject('ICommentRepository')
    private readonly commentRepository: ICommentRepository,
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async createComment(commentDto: CommentDto, user: UserEntity, videoId: number) {
    const checkGroupNumber: CommentEntity =
      await this.commentRepository.findCommentByVideoIdAndDepth(videoId);

    const newGroupNumber: number = (checkGroupNumber?.commentGroup ?? 0) + 1;

    const createComment: CommentEntity = this.commentRepository.createComment(
      user.id,
      commentDto.content,
      newGroupNumber,
      videoId,
    );

    await this.commentRepository.save(createComment);

    await this.forwardNotification(videoId, user.id);

    return createComment;
  }

  async findAll(videoId: number) {
    await this.verifyVideo(videoId);
    const comment = await this.commentRepository.findAllComment(videoId);
    return { data: comment };
  }

  async findOne(videoId: number, commentId: number) {
    await this.verifyVideo(videoId);
    await this.forFindOneVerifyComment(commentId);

    const comment = await this.commentRepository.findAllReplyComment(commentId);
    return comment;
  }

  async updateComment(
    videoId: number,
    commentId: number,
    commentDto: CommentDto,
    user: UserEntity,
  ) {
    await this.verifyUser(user);
    await this.verifyComment(user.id, commentId, videoId);

    await this.commentRepository.updateComment(commentId, commentDto.content);

    const findUpdatedComment = await this.commentRepository.findCommentByCommentId(commentId);

    return findUpdatedComment;
  }

  async removeComment(videoId: number, commentId: number, user: UserEntity) {
    await this.verifyUser(user);
    await this.verifyComment(user.id, commentId, videoId);

    const result = await this.commentRepository.deleteComment(commentId);

    if (result.affected === 1) {
      return { success: true, message: 'Comment deleted successfully' };
    } else {
      throw new BadRequestException('댓글을 삭제하는 중에 에러가 발생 했습니다.');
    }
  }

  async createReply(videoId: number, commentId: number, user: UserEntity, commentDto: CommentDto) {
    await this.verifyComment(user.id, commentId, videoId);

    const checkComment = await this.commentRepository.findCommentByCommentId(commentId);
    if (!checkComment) {
      throw new NotFoundException('해당하는 댓글이 존재하지 않습니다.');
    }
    const checkReply = await this.commentRepository.findReplyByCommentGroup(
      checkComment.commentGroup,
    );

    //변수만들기
    

    const newOrderNumber = (checkReply?.orderNumber ?? 1) + 1;

    const createReply = this.commentRepository.createReply(
      user.id,
      commentDto.content,
      commentId,
      newOrderNumber,
      checkComment.commentGroup,
      videoId,
    );

    await this.commentRepository.save(createReply);

    await this.forwardNotification(videoId, user.id);

    return createReply;
  }

  private async verifyComment(userId: number, commentId: number, videoId: number) {
    const findComment = await this.commentRepository.findCommentUserIdAndCommentIdAndVideoId(
      userId,
      commentId,
      videoId,
    );

    if (_.isNil(findComment)) {
      throw new NotFoundException('해당하는 댓글이 존재하지 않습니다.');
    }

    return findComment;
  }

  private async verifyVideo(videoId: number) {
    const findVideo = await this.videoRepository.findVideoByVideoId(videoId);

    if (_.isNil(findVideo)) {
      throw new NotFoundException('해당하는 비디오가 존재하지 않습니다.');
    }

    return findVideo;
  }

  private async forFindOneVerifyComment(commentId: number) {
    const findComment = await this.commentRepository.findCommentByCommentId(commentId);

    if (!findComment) {
      throw new NotFoundException('해당하는 댓글이 존재하지 않습니다.');
    }

    return findComment;
  }

  private async verifyUser(user: UserEntity) {
    const existingUser = await this.commentRepository.findCommentByUserId(user.id);

    if (!existingUser) {
      throw new NotFoundException('해당하는 유저는 권한이 없습니다.');
    }
  }

  private async forwardNotification(videoId: number, userId: number) {
    const message = `${userId}님이 ${videoId} 영상에 댓글을 달았습니다.`;

    this.notificationService.emitNotification(message, videoId);
  }
}
