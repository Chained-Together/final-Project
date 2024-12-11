import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class FindPasswordDto {
  @IsOptional()
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  email?: string;

  @IsOptional()
  @IsPhoneNumber('KR', { message: '유효한 전화번호를 입력해주세요.' })
  phoneNumber?: string;
}
