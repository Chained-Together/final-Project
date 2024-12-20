import { IsArray, IsEnum, IsString } from 'class-validator';
import { Visibility } from '../video.visibility.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVideoDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  thumbnailUrl: string;

  @IsString({ each: true })
  @IsArray()
  @ApiProperty()
  hashtags: string[];

  @IsEnum(Visibility)
  @ApiProperty()
  visibility: Visibility;
}
