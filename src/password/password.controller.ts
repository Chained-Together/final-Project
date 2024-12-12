import { Body, Controller, Post, Query } from '@nestjs/common';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { PasswordService } from './password.service';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post('reset-request')
  async resetPasswordRequest(@Body() dto: ResetPasswordRequestDto): Promise<void> {
    await this.passwordService.resetPasswordRequest(dto.email);
  }

  @Post('update')
  async updatePassword(
    @Query('token') token: string,
    @Body() dto: UpdatePasswordDto,
  ): Promise<string> {
    await this.passwordService.resetPassword(token, dto.newPassword);
    return 'Password successfully reset';
  }
}
