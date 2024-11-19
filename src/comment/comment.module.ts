import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { VideoEntity } from 'src/video/entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, VideoEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
