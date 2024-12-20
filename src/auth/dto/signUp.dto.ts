import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  @ApiProperty({ description: '이메일' })
  email: string;

  @IsString()
  @Length(8, 16, { message: '비밀번호는 8자 이상이며 16글자 이하만 가능합니다.' })
  @IsNotEmpty({ message: '비밀 번호를 입력해주세요.' })
  @ApiProperty({ description: '비밀번호' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '확인 비밀 번호를 입력해주세요.' })
  @ApiProperty({ description: '비밀번호 확인' })
  confirmedPassword: string;

  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  @ApiProperty({ description: '이름' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @IsString()
  @IsNotEmpty({ message: '인증 코드를 입력해주세요.' })
  @ApiProperty({ description: '이메일 인증 코드' })
  code: string;

  @IsString()
  @IsNotEmpty({ message: '전화번호를 입력해주세요.' })
  @ApiProperty({ description: '전화번호' })
  phoneNumber: string;
}
