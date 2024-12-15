import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { SignUpDto } from './dto/signUp.dto';
import { AuthGuard } from '@nestjs/passport';

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

    res.setHeader('Authorization', result.access_token);

    return res.status(200).json({
      message: '로그인 성공',
    });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
  //   const token = await this.authService.googleLogin(req);
  //   console.log(token);
  //   res.cookie('Authorization', token.access_token, {
  //     httpOnly: false,  // 쿠키를 JavaScript에서 접근 가능하게 설정
  //     secure: false,  // HTTPS에서만 작동하도록 설정
  //     sameSite:'lax'
  //   });
  //   res.redirect(`/`);
  // }
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    console.log('Received request at /google/callback'); // 콜백 요청 로그
  
    const token = await this.authService.googleLogin(req);
    console.log('Generated token:', token);
  
    res.cookie('Authorization', token.access_token)
  
    res.redirect('/'); // 메인 페이지로 리다이렉트
  }

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverAuth() {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverAuthCallback(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.naverLogin(req);

    res.cookie('Authorization', token.access_token);
    res.redirect(`/`);
  }
}
