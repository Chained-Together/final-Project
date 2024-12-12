import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelDto {
  @IsString()
  @IsNotEmpty({ message: '채널 제목을 입력해주세요.' })
  name?: string;

  @IsString()
  profileImage?: string;
}
