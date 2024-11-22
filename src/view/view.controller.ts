import { Controller, Get, Render } from '@nestjs/common';

@Controller('')
export class ViewController {
  @Get('/main')
  @Render('main')
  showMainPage() {
    return;
  }

  @Get('/signin')
  @Render('signin')
  showSigninPage() {
    return;
  }

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

  @Get('/channel')
  @Render('channel')
  showChannelPage() {
    return;
  }

  @Get('/upload')
  @Render('file-upload')
  showUploadPage() {
    return;
  }
}
