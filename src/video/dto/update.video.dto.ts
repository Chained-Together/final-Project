import { IsArray, IsEnum, IsString, IsUrl } from 'class-validator';
import { Visibility } from '../video.visibility.enum';

export class UpdateVideoDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  thumbnailUrl: string;

  @IsString({ each: true })
  @IsArray()
  hashtags: string[];

  @IsEnum(Visibility)
  visibility: Visibility;
}
