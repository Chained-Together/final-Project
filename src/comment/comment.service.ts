import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { UserEntity } from 'src/user/entity/user.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { Repository } from 'typeorm';
import { CommentDto } from './dto/comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {}

  async createComment(commentDto: CommentDto, user: UserEntity, videoId: number) {
    const checkGroupNumber = await this.commentRepository.findOne({
      where: { video: { id: videoId }, depth: 0 },
      order: {
        orderNumber: 'DESC',
      },
    });

    const newGroupNumber = (checkGroupNumber?.commentGroup ?? 0) + 1;

    const createComment = this.commentRepository.create({
      userId: user.id,
      content: commentDto.content,
      parentComment: 0,
      depth: 0,
      orderNumber: 1,
      commentGroup: newGroupNumber,
      video: { id: videoId },
    });

    await this.commentRepository.save(createComment);

    return createComment;
  }

  async findAll(videoId: number) {
    await this.verifyVideo(videoId);
    const comment = await this.commentRepository.find({
      where: { video: { id: videoId }, depth: 0 },
      select: ['id', 'userId', 'content', 'createdAt'],
      order: { createdAt: 'ASC' },
    });
    return { data: comment };
  }

  async findOne(videoId: number, commentId: number) {
    await this.verifyVideo(videoId);
    await this.forFindOneVerifyComment(commentId);

    const checkCommentGroup = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    const comment = await this.commentRepository.find({
      where: { commentGroup: checkCommentGroup.commentGroup },
      select: ['id', 'userId', 'content', 'createdAt'],
      order: {
        orderNumber: 'ASC',
      },
    });

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

    await this.commentRepository.update({ id: commentId }, { content: commentDto.content });

    const findUpdatedComment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    return findUpdatedComment;
  }

  async removeComment(videoId: number, commentId: number, user: UserEntity) {
    await this.verifyUser(user);
    await this.verifyComment(user.id, commentId, videoId);

    const result = await this.commentRepository.delete({ id: commentId });

    if (result.affected === 1) {
      return { success: true, message: '댓글이 성공적으로 삭제 되었습니다.' };
    } else {
      throw new BadRequestException('댓글을 삭제하는 중에 에러가 발생 했습니다.');
    }
  }

  async createReply(videoId: number, commentId: number, user: UserEntity, commentDto: CommentDto) {
    await this.verifyComment(user.id, commentId, videoId);

    const checkComment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    const checkReply = await this.commentRepository.findOne({
      where: { commentGroup: checkComment.commentGroup, depth: 1 },
      order: {
        orderNumber: 'DESC',
      },
    });

    const newOrderNumber = (checkReply?.orderNumber ?? 1) + 1;

    const createReply = this.commentRepository.create({
      userId: user.id,
      content: commentDto.content,
      parentComment: commentId,
      depth: 1,
      orderNumber: newOrderNumber,
      commentGroup: checkComment.commentGroup,
      video: { id: videoId },
    });

    await this.commentRepository.save(createReply);

    return createReply;
  }

  private async verifyComment(userId: number, commentId: number, videoId: number) {
    const findComment = await this.commentRepository.findOneBy({
      userId: userId,
      id: commentId,
      video: { id: videoId },
    });

    if (_.isNil(findComment)) {
      throw new NotFoundException('해당하는 댓글이 존재하지 않습니다.');
    }

    return findComment;
  }

  private async verifyVideo(videoId: number) {
    const findVideo = await this.videoRepository.find({
      where: { id: videoId },
    });
    if (_.isNil(findVideo)) {
      throw new NotFoundException('해당하는 비디오가 존재하지 않습니다.');
    }
  }

  private async forFindOneVerifyComment(commentId: number) {
    const findComment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!findComment) {
      throw new NotFoundException('해당하는 댓글이 존재하지 않습니다.');
    }
  }

  private async verifyUser(user: UserEntity) {
    const existingUser = await this.commentRepository.findOne({
      where: { userId: user.id },
    });

    if (!existingUser) {
      throw new NotFoundException('해당하는 유저는 권한이 없습니다.');
    }
  }
}
