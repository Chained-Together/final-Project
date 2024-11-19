import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLikeDto {

  @IsNumber()
  @IsNotEmpty()
  videoId: number;

}
