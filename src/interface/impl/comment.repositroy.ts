import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ICommentRepository } from '../comment-interface';

@Injectable()
export class CommentRepository implements ICommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly repository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  findCommentByVideoId(videoId: number): Promise<CommentEntity | null> {
    return this.repository.findOne({ where: { video: { id: videoId } } });
  }
  findCommentByVideoIdAndDepth(videoId: number): Promise<CommentEntity | null> {
    return this.repository.findOne({
      where: { video: { id: videoId }, depth: 0 },
      order: {
        createdAt: 'DESC',
      },
    });
  }
  findCommentByCommentId(commentId: number): Promise<CommentEntity | null> {
    return this.repository.findOne({ where: { id: commentId } });
  }
  createComment(
    userId: number,
    content: string,
    commentGroup: number,
    videoId: number,
  ): CommentEntity {
    return this.repository.create({
      userId,
      content,
      parentComment: 0,
      depth: 0,
      orderNumber: 1,
      commentGroup,
      video: { id: videoId },
    });
  }
  save(comment: CommentEntity): Promise<CommentEntity> {
    return this.repository.save(comment);
  }
  async findAllComment(videoId: number): Promise<CommentEntity[]> {
    const comments = await this.repository.find({
      where: { video: { id: videoId }, depth: 0 },
      select: ['id', 'userId', 'content', 'createdAt'],
      order: { createdAt: 'ASC' },
    });

    const commentsWithUser = await Promise.all(
      comments.map(async (comment) => {
        const user = await this.userRepository.findOne({
          where: { id: comment.userId },
        });

        return {
          ...comment,
          nickname: user?.nickname || '알 수 없음',
        };
      }),
    );

    return commentsWithUser;
  }

  async findAllReplyComment(commentId: number): Promise<CommentEntity[]> {
    const replies = await this.repository.find({
      where: { parentComment: commentId, depth: 1 },
      select: ['id', 'userId', 'content', 'createdAt'],
      order: {
        orderNumber: 'ASC',
      },
    });

    const repliesWithUser = await Promise.all(
      replies.map(async (reply) => {
        const user = await this.userRepository.findOne({
          where: { id: reply.userId },
        });

        return {
          ...reply,
          nickname: user?.nickname || '알 수 없음',
        };
      }),
    );

    return repliesWithUser;
  }
  findCommentUserIdAndCommentIdAndVideoId(
    userId: number,
    commentId: number,
    videoId: number,
  ): Promise<CommentEntity> {
    return this.repository.findOneBy({
      userId,
      id: commentId,
      video: { id: videoId },
    });
  }
  updateComment(commentId: number, content: string): Promise<UpdateResult> {
    return this.repository.update(
      {
        id: commentId,
      },
      {
        content,
      },
    );
  }
  deleteComment(commentId: number): Promise<DeleteResult> {
    return this.repository.delete({
      id: commentId,
    });
  }
  findReplyByCommentGroup(commentGroup: number): Promise<CommentEntity> {
    return this.repository.findOne({
      where: { commentGroup, depth: 1 },
      order: {
        orderNumber: 'DESC',
      },
    });
  }
  createReply(
    userId: number,
    content: string,
    commentId: number,
    orderNumber: number,
    commentGroup: number,
    videoId: number,
  ): CommentEntity {
    return this.repository.create({
      userId,
      content,
      parentComment: commentId,
      depth: 1,
      orderNumber,
      commentGroup,
      video: { id: videoId },
    });
  }
  findCommentByUserId(userId: number): Promise<CommentEntity> {
    return this.repository.findOne({
      where: { userId },
    });
  }
}
