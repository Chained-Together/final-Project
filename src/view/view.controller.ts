import { Controller, Get, Param, Query, Render, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { JwtQueryAuthGuard } from '../utils/jwtquery-authguard';
import { UserInfo } from '../utils/user-info.decorator';

@ApiTags('페이지 렌더링 API') // Swagger 그룹 태그
@Controller('')
export class ViewController {
  @Get('/')
  @Render('new-main')
  @ApiOperation({ summary: '메인 페이지 렌더링', description: '메인 페이지를 렌더링합니다.' })
  showMainPage() {
    return;
  }

  @Get('/videolist')
  @Render('new-video-list')
  @ApiOperation({
    summary: '동영상 목록 페이지 렌더링',
    description: '동영상 목록 페이지를 렌더링합니다.',
  })
  showListPage() {
    return;
  }

  @Get('/signin')
  @Render('signin')
  @ApiOperation({ summary: '로그인 페이지 렌더링', description: '로그인 페이지를 렌더링합니다.' })
  showSigninPage() {
    return;
  }

  @Get('/signup')
  @Render('signup')
  @ApiOperation({
    summary: '회원가입 페이지 렌더링',
    description: '회원가입 페이지를 렌더링합니다.',
  })
  showSignupPage() {
    return;
  }

  @Get('/login')
  @Render('login')
  @ApiOperation({
    summary: '로그인 페이지 렌더링 (추가)',
    description: '로그인 페이지를 렌더링합니다.',
  })
  showLoginPage() {
    return;
  }

  @Get('/create-channel')
  @Render('create-channel')
  @ApiOperation({
    summary: '채널 생성 페이지 렌더링',
    description: '새로운 채널을 생성하는 페이지를 렌더링합니다.',
  })
  showCreateChannelPage() {
    return;
  }

  @Get('/getChannel/:id')
  @Render('channel')
  @ApiOperation({
    summary: '채널 정보 페이지 렌더링',
    description: '특정 채널 정보를 보여주는 페이지를 렌더링합니다.',
  })
  showGetChannelPage() {
    return;
  }

  @Get('/myChannel')
  @Render('new-channel')
  @ApiOperation({
    summary: '내 채널 페이지 렌더링',
    description: '사용자의 채널 정보를 보여주는 페이지를 렌더링합니다.',
  })
  showChannelPage() {
    return;
  }

  @Get('/edit-mychannel')
  @Render('edit-my-channel')
  @ApiOperation({
    summary: '내 채널 수정 페이지 렌더링',
    description: '내 채널 정보를 수정할 수 있는 페이지를 렌더링합니다.',
  })
  showEditPage() {
    return;
  }

  @Get('/upload')
  @Render('new-file-upload')
  @ApiOperation({
    summary: '파일 업로드 페이지 렌더링',
    description: '파일을 업로드할 수 있는 페이지를 렌더링합니다.',
  })
  showUploadPage() {
    return;
  }

  @Get('/findInfo')
  @Render('findInfo')
  @ApiOperation({
    summary: '정보 찾기 페이지 렌더링',
    description: '비밀번호 또는 계정 정보를 찾는 페이지를 렌더링합니다.',
  })
  showFindInfoPage() {
    return;
  }

  @Get('/reset-password')
  @Render('reset-password')
  @ApiOperation({
    summary: '비밀번호 재설정 페이지 렌더링',
    description: '비밀번호 재설정을 위한 페이지를 렌더링합니다.',
  })
  @ApiQuery({
    name: 'token',
    description: '비밀번호 재설정 토큰',
    required: true,
  })
  showResetPasswordPage(@Query('token') token: string) {
    return { token };
  }

  @Get('/search')
  @Render('search')
  @ApiOperation({
    summary: '검색 페이지 렌더링',
    description: '검색 결과를 보여주는 페이지를 렌더링합니다.',
  })
  @ApiQuery({
    name: 'keyword',
    description: '검색 키워드',
    required: false,
  })
  showSearchPage(@Query('keyword') keyword: string) {
    return;
  }

  // @UseGuards(JwtQueryAuthGuard)
  // @Get('/chat/:roomId')
  // @Render('chat')
  // @ApiOperation({
  //   summary: '채팅 페이지 렌더링',
  //   description: '특정 채팅방의 채팅 내용을 보여주는 페이지를 렌더링합니다.',
  // })
  // showChat(@Param('roomId') roomId: string, @UserInfo() user: UserEntity) {
  //   return { roomId, user };
  // }

  @Get('/liveVideo')
  @Render('liveVideo')
  @ApiOperation({
    summary: '촬영 업로드 페이지 렌더링',
    description: '촬영 후 업로드하는 페이지를 렌더링합니다.',
  })
  showLiveVideo() {
    return;
  }

  @Get('liveStream')
  @Render('live')
  showLiveList() {
    return;
  }

  @Get('live/watch/:id')
  @Render('live-watch')
  @ApiOperation({
    summary: '라이브 시청 페이지 렌더링',
    description: '라이브 방송을 시청하는 페이지를 렌더링합니다.',
  })
  getLiveWatchPage() {
    return {};
  }

  @Get('/detail')
  @Render('detail-video')
  VideoDetail() {
    return;
  }

  @Get('/chat')
  @Render('chat')
  showChat() {
    return;
  }
  // showChat(@Param('roomId') roomId: string, @UserInfo() user: UserEntity) {
  //   return { roomId, user };
  // }
}
