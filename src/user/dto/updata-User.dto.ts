import { IsEmail, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @Length(2, 50, { message: '이름은 2자 이상, 50자 이하로 입력해주세요.' })
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @Length(2, 30, { message: '닉네임은 2자 이상, 30자 이하로 입력해주세요.' })
  @ApiProperty()
  nickname?: string;

  @IsOptional()
  @IsPhoneNumber('KR', { message: '유효한 전화번호를 입력해주세요.' })
  @ApiProperty()
  phoneNumber?: string;
}
