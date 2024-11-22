import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  singUp(@Body() signUpDTO: SignUpDto) {
    return this.authService.signUp(signUpDTO);
  }

  @Post('login')
  async logIn(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.logIn(loginDto);
    res.setHeader('Authorization', result.access_token);

    return res.status(200).json({
      message: '로그인 성공',
      // 홈페이지 리턴되게
    });
  }
}
