import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { SignUpDto } from './dto/signUp.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자를 등록합니다. 입력한 정보를 바탕으로 회원 정보를 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '유저가 성공적으로 생성되었습니다.',
    type: UserEntity,
  })
  singUp(@Body() signUpDTO: SignUpDto, @Req() req: Request) {
    return this.authService.signUp(signUpDTO, req);
  }

  @Post('login')
  @ApiOperation({
    summary: '로그인',
    description:
      '입력한 이메일과 비밀번호를 사용하여 로그인을 진행합니다. 성공 시 JWT 토큰을 반환합니다.',
  })
  @ApiOkResponse({
    description: '로그인 성공. JWT 토큰이 응답 헤더와 바디에 포함됩니다.',
  })
  async logIn(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.logIn(loginDto);

    res.setHeader('Authorization', result.access_token);

    return res.status(200).json({
      message: '로그인 성공',
    });
  }

  @Get('google')
  @ApiOperation({
    summary: 'Google 로그인',
    description: 'Google 계정을 사용하여 로그인 프로세스를 시작합니다.',
  })
  @ApiOkResponse({
    description: 'Google 인증을 위한 리다이렉션 URL이 반환됩니다.',
  })
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @ApiOperation({
    summary: 'Google 로그인 콜백',
    description: 'Google 인증 후 반환된 데이터를 기반으로 JWT 토큰을 생성합니다.',
  })
  @ApiOkResponse({
    description: 'Google 로그인이 성공적으로 처리되었으며, JWT 토큰이 설정된 쿠키로 반환됩니다.',
  })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    console.log('Received request at /google/callback'); // 콜백 요청 로그

    const token = await this.authService.googleLogin(req);
    console.log('Generated token:', token);

    res.cookie('Authorization', token.access_token);

    res.redirect('/'); // 메인 페이지로 리다이렉트
  }

  @Get('naver')
  @ApiOperation({
    summary: 'Naver 로그인',
    description: 'Naver 계정을 사용하여 로그인 프로세스를 시작합니다.',
  })
  @ApiOkResponse({
    description: 'Naver 인증을 위한 리다이렉션 URL이 반환됩니다.',
  })
  @UseGuards(AuthGuard('naver'))
  async naverAuth() {}

  @Get('naver/callback')
  @ApiOperation({
    summary: 'Naver 로그인 콜백',
    description: 'Naver 인증 후 반환된 데이터를 기반으로 JWT 토큰을 생성합니다.',
  })
  @ApiOkResponse({
    description: 'Naver 로그인이 성공적으로 처리되었으며, JWT 토큰이 설정된 쿠키로 반환됩니다.',
  })
  @UseGuards(AuthGuard('naver'))
  async naverAuthCallback(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.naverLogin(req);

    res.cookie('Authorization', token.access_token);
    res.redirect(`/`);
  }
}
