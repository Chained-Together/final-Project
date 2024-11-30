import { Controller, Get, Query, Render } from '@nestjs/common';

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

  @Get('/create-channel')
  @Render('create-channel')
  showCreateChannelPage() {
    return;
  }

  @Get('/getChannel/:id')
  @Render('channel')
  showGetChannelPage() {
    return;
  }

  @Get('/myChannel')
  @Render('my-channel')
  showChannelPage() {
    return;
  }

  @Get('/edit-mychannel')
  @Render('edit-my-channel')
  showEditPage() {
    return;
  }

  @Get('/upload')
  @Render('file-upload')
  showUploadPage() {
    return;
  }

  @Get('/findInfo')
  @Render('findInfo')
  showFindInfoPage() {
    return;
  }

  @Get('/reset-password')
  @Render('reset-password')
  showResetPasswordPage(@Query('token') token: string) {
    return { token };
  }

  @Get('/view-video')
  @Render('video')
  showVideoPage() {
    return;
  }

  @Get('/liveVideo')
  @Render('liveVideo')
  showLiveVideo() {
    return;
  }
}
