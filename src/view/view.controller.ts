import { Controller, Get, Render } from '@nestjs/common';

@Controller('')
export class ViewController {
  @Get('/signup')
  @Render('signup')
  showSignupPage() {
    return;
  }

  @Get('/login')
  @Render('login')
  showLoginPage() {
    return;
  }

  @Get('/upload')
  @Render('file-upload')
  showUploadPage() {
    return;
  }
}
