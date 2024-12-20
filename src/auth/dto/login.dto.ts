import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @ApiProperty({ description: '이메일' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @ApiProperty({ description: '비밀번호' })
  password: string;
}
