import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SendEmailDto {
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @IsString()
  @ApiProperty({ description: '이메일' })
  email: string;
}
