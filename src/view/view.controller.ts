import { Controller, Get, Param, Query, Render, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from '../utils/user-info.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { HeaderLoggerGuard } from '../utils/header-log.guard';

@Controller('')
export class ViewController {
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

  @Get('/search')
  @Render('search')
  showSearchPage(@Query('keyword') keyword: string) {
    return;
  }

  @Get('/stream')
  @Render('stream')
  showstream() {
    return;
  }

  @Get('chat/:roomId')
  @Render('chat')
  showChat(@Param('roomId') roomId: string) {
    return { roomId }; // user 정보 제거
  }
}
