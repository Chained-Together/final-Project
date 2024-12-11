import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMetadataDto {
  @IsString()
  @IsNotEmpty()
  videoUrl: string;

  @IsNotEmpty()
  metadata: {
    videoCode: string;
    duration: number;
    thumbnail: string;
  };
}
