import { IsString } from 'class-validator';
export class LiveStreamingDto {
  @IsString()
  title: string;
}
