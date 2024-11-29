import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SignUpDto } from './dto/signUp.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  singUp(@Body() signUpDTO: SignUpDto, @Req() req: Request) {
    return this.authService.signUp(signUpDTO, req);
  }

  @Post('login')
  async logIn(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.logIn(loginDto);
    //
    res.setHeader('Authorization', result.access_token);

    return res.status(200).json({
      message: '로그인 성공',
      // 홈페이지 리턴되게
    });
  }

  @Get('google')
  @UseGuards(AuthGuard('google')) // 1.구글 전략
  async googleAuth() {}

  @Get('google/callback') //2.여기로 보내짐
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.googleLogin(req);
    console.log(token);
    res.setHeader('Authorization', token.access_token);
    res.redirect(`/main?token=${token.access_token}`);
  }

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverAuth() {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverAuthCallback(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.naverLogin(req);

    res.setHeader('Authorization', token.access_token);
    res.redirect(`/main?token=${token.access_token}`);
  }
}
