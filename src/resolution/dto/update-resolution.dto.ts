import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMetadataDto {
  @IsString()
  @IsNotEmpty()
  highResolutionUrl: string;

  @IsString()
  @IsNotEmpty()
  lowResolutionUrl: string;

  @IsNotEmpty()
  metadata: {
    videoCode: string;
    duration: number;
  };
}
