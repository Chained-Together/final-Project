import { Controller, Get, Param, Query, Render, UseGuards } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { JwtQueryAuthGuard } from '../utils/jwtquery-authguard';
import { UserInfo } from '../utils/user-info.decorator';

@Controller('')
export class ViewController {
  @Get('/videolist')
  @Render('new-video-list')
  showListPage() {
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
  @Render('new-channel')
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
  @Get('/obs')
  @Render('obs')
  showsobs() {
    return;
  }

  @UseGuards(JwtQueryAuthGuard)
  @Get('chat/:roomId')
  @Render('chat')
  showChat(@Param('roomId') roomId: string, @UserInfo() user: UserEntity) {
    return { roomId, user };
  }

  @UseGuards(JwtQueryAuthGuard)
  @Get('/main-chat')
  @Render('chat')
  showMainChat(@UserInfo() user: UserEntity) {
    return { roomId: 'main-room', user };
  }
  @Get('/liveStream')
  @Render('live')
  showLiveList() {
    return;
  }

  @Get('live/watch/:id')
  @Render('live-watch')
  getLiveWatchPage() {
    return {};
  }
}
