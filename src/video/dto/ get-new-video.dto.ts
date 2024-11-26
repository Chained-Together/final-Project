import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class GetNewVideoDto {
  @IsOptional() // lastId는 선택적
  @IsInt() // lastId는 숫자여야 한다는 제약
  @Min(1) // lastId는 1 이상이어야 한다는 제약
  lastId?: number;
}
