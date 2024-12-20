import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindPasswordDto {
  @IsOptional()
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('KR', { message: '유효한 전화번호를 입력해주세요.' })
  @ApiProperty()
  phoneNumber?: string;
}
