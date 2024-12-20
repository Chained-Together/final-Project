import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty({ message: '전화번호를 입력해주세요.' })
  @ApiProperty()
  phoneNumber: string;
}
