import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @Render('login')
  showLoginPage() {
    return;
  }



  @Post('signUp')
  singUp(@Body() signUpDTO: SignUpDto) {
    return this.authService.signUp(signUpDTO);
  }

  @Post('login')
  logIn(@Body() loginDTO: LoginDto) {
    return this.authService.logIn(loginDTO);
  }
}
