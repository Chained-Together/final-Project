import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChannelDto {
  @IsString()
  @IsNotEmpty({ message: '채널 제목을 입력해주세요.' })
  @ApiProperty()
  name?: string;

  @IsString()
  @ApiProperty()
  profileImage?: string;
}
