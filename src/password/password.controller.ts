import { Controller, Post, Body, Query } from '@nestjs/common';
import { PasswordService } from './password.service';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  // 비밀번호 초기화 요청
  @Post('reset-request')
  async resetPasswordRequest(@Body() dto: ResetPasswordRequestDto): Promise<void> {
    await this.passwordService.resetPasswordRequest(dto.email);
  }

  // 비밀번호 변경
  @Post('update')
  async updatePassword(
    @Query('token') token: string,
    @Body() dto: UpdatePasswordDto,
  ): Promise<string> {
    await this.passwordService.resetPassword(token, dto.newPassword);
    return 'Password successfully reset';
  }
}
