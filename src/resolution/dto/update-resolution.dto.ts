import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMetadataDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  videoUrl: string;

  @IsNotEmpty()
  @ApiProperty()
  metadata: {
    videoCode: string;
    duration: number;
    thumbnail: string;
  };
}
