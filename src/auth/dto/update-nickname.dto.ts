import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from './signUp.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNicknameDto extends PartialType(SignUpDto) {
  @IsString()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @ApiProperty({ description: '이메일' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @ApiProperty({ description: '비밀번호' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '변경할 닉네임를 입력해주세요.' })
  @ApiProperty({ description: '변경할 닉네임' })
  nickname: string;
}
