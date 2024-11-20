import { Controller, Get, Render } from '@nestjs/common';

@Controller('')
export class ViewController {
  @Get('/login')
  @Render('login')
  showLoginPage() {
    return;
  }

  //업로드페이지 엔드포인트
  @Get('/upload')
  @Render('file-upload')
  showUploadPage() {
    return;
  }
}
