import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('video')
export class VideoController {
  // @Get()
  //  @UseGuards(AuthGuard('jwt'))
}
