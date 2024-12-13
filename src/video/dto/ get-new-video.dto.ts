import { IsInt, IsOptional, Min } from 'class-validator';

export class GetNewVideoDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  lastId?: number;
}
