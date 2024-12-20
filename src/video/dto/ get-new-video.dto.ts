import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetNewVideoDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty()
  lastId?: number;
}
