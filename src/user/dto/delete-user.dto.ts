import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDto {
  @IsString()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @ApiProperty()
  password: string;
}
