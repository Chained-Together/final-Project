import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Visibility } from '../video.visibility.enum';
import { ApiProperty } from '@nestjs/swagger';

export class VideoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  videoCode: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  @ApiProperty()
  hashtags: string[];

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  duration: number;

  @IsNotEmpty()
  @IsEnum(Visibility)
  @ApiProperty()
  visibility: Visibility;

  @IsOptional()
  @IsString()
  @ApiProperty()
  accessKey?: string;
}
