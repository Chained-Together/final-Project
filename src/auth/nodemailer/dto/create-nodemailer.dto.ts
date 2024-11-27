import { IsString, IsNotEmpty } from 'class-validator';
export class SendEmailDto {
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @IsString()
  email: string;
}
