import {
  IsArray,
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { Visibility } from '../video.visibility.enum';

export class VideoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  thumbnailURL: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  hashtags: string[];

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsUrl()
  high: string;

  @IsNotEmpty()
  @IsUrl()
  low: string;

  @IsNotEmpty()
  @IsEnum(Visibility)
  visibility: Visibility;
}
