import { IsNotEmpty, IsString } from 'class-validator';

export class CommentDto {
  @IsString()
  @IsNotEmpty({ message: '댓글 내용을 입력해 주세요.' })
  content: string;
}
