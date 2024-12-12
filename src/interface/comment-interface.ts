import { CommentEntity } from 'src/comment/entities/comment.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

export interface ICommentRepository {
  findCommentByVideoId(videoId: number): Promise<CommentEntity | null>;
  findCommentByVideoIdAndDepth(videoId: number): Promise<CommentEntity | null>;
  findCommentByCommentId(commentId: number): Promise<CommentEntity | null>;
  createComment(
    userId: number,
    content: string,
    commentGroup: number,
    videoId: number,
  ): CommentEntity;
  save(comment: CommentEntity): Promise<CommentEntity>;
  findAllComment(videoId: number): Promise<CommentEntity[]>;
  findAllReplyComment(commentId: number): Promise<CommentEntity[]>;
  findCommentUserIdAndCommentIdAndVideoId(
    userId: number,
    commentId: number,
    videoId: number,
  ): Promise<CommentEntity>;
  updateComment(commentId: number, content: string): Promise<UpdateResult>;
  deleteComment(commentId: number): Promise<DeleteResult>;
  findReplyByCommentGroup(commentGroup: number): Promise<CommentEntity>;
  createReply(
    userId: number,
    content: string,
    commentId: number,
    orderNumber: number,
    commentGroup: number,
    videoId: number,
  ): CommentEntity;
  findCommentByUserId(userId: number): Promise<CommentEntity>;
}
