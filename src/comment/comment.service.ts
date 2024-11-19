import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CommentDto } from './dto/comment.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import _ from 'lodash';
import { VideoEntity } from 'src/video/entities/video.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {}

  async createComment(commentDto: CommentDto, user: UserEntity, videoId: number) {
    const createComment = this.commentRepository.create({
      userId: user.id,
      content: commentDto.content,
      //   video: { id: videoId },
    });

    await this.commentRepository.save(createComment);

    return createComment;
  }
  async findAll(videoId: number) {
    await this.verifyVideo(videoId);
    const comment = await this.commentRepository.find({
      where: { id: videoId },
      select: ['id', 'userId', 'content', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
    return { data: comment };
  }

  //TODO: 답글 부분 와선하고 추가하기
  async findOne(videoId: number, commentId: number) {
    await this.verifyVideo(videoId);
    await this.forFindOneverifyComment(commentId);

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      // relations: ['replies'],
      // select: ['id', 'userId', 'content', 'createdAt'],
    });
    return comment;
  }

  async updateComment(
    videoId: number,
    commentId: number,
    user: UserEntity,
    commentDto: CommentDto,
  ) {
    await this.verifyComment(user.id, commentId);

    await this.commentRepository.update({ id: commentId }, { content: commentDto.content });

    const findUpdatedComment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    return findUpdatedComment;
  }

  async removeComment(videoId: number, commentId: number, user: UserEntity) {
    await this.verifyComment(user.id, commentId);

    const result = await this.commentRepository.delete({ id: commentId });

    if (result.affected === 1) {
      return { success: true, message: '댓글이 성공적으로 삭제 되었습니다.' };
    } else {
      throw new BadRequestException('댓글을 삭제하는 중에 에러가 발생 했습니다.');
    }
  }

  // TODO: 나중에 videoId도 추가해야됨
  private async verifyComment(userId: number, commentId: number) {
    const findComment = await this.commentRepository.findOneBy({ userId: userId, id: commentId });

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

  private async forFindOneverifyComment(commentId: number) {
    const findComment = await this.commentRepository.find({
      where: { id: commentId },
    });
    if (!findComment) {
      throw new NotFoundException('해당하는 댓글이 존재하지 않습니다.');
    }
  }
}
