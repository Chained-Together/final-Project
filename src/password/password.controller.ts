import { Body, Controller, Post, Query } from '@nestjs/common';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { PasswordService } from './password.service';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('비밀번호 관리 API') // Swagger 그룹 태그
@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post('reset-request')
  @ApiOperation({
    summary: '비밀번호 재설정 요청',
    description:
      '사용자의 이메일을 입력하여 비밀번호 재설정을 요청합니다. 이메일로 재설정 링크가 전송됩니다.',
  })
  @ApiOkResponse({
    description: '비밀번호 재설정 요청이 성공적으로 처리되었습니다.',
  })
  async resetPasswordRequest(@Body() dto: ResetPasswordRequestDto): Promise<void> {
    await this.passwordService.resetPasswordRequest(dto.email);
  }

  @Post('update')
  @ApiOperation({
    summary: '비밀번호 업데이트',
    description: '토큰과 새로운 비밀번호를 사용하여 비밀번호를 재설정합니다.',
  })
  @ApiOkResponse({
    description: '비밀번호가 성공적으로 재설정되었습니다.',
    type: String, // 반환 타입 명시
  })
  async updatePassword(
    @Query('token') token: string,
    @Body() dto: UpdatePasswordDto,
  ): Promise<string> {
    await this.passwordService.resetPassword(token, dto.newPassword);
    return 'Password successfully reset';
  }
}
