import {
  IsArray,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
  @IsString()
  thumbnailUrl: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  hashtags: string[];

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  high: string;

  @IsOptional()
  @IsString()
  low: string;

  @IsNotEmpty()
  @IsEnum(Visibility)
  visibility: Visibility;
}
