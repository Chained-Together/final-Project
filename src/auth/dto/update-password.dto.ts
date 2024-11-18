import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from './signUp.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto extends PartialType(SignUpDto) {
  @IsString()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '현재 비밀번호를 입력해주세요.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '변경 하실 비밀번호를 입력해주세요.' })
  newPassword: string;
}
