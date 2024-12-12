import { Controller, Get, Post } from '@nestjs/common';
import { ObsService } from './obs.service';

@Controller('obs')
export class ObsController {
  constructor(private readonly obsService: ObsService) {}


  @Post('start-streaming')
  async startStreaming() {
    await this.obsService.startStreaming();
    return { message: 'Streaming started' };
  }


  @Post('stop-streaming')
  async stopStreaming() {
    await this.obsService.stopStreaming();
    return { message: 'Streaming stopped' };
  }


  @Get('streaming-status')
  async getStreamingStatus() {
    const status = await this.obsService.getStreamingStatus();
    return { status };
  }


  @Get('getSceneList')
  async getSceneList() {
    const sceneList = await this.obsService.getSceneList();
    return { scenes: sceneList };
  }


  @Get('getCurrentScene')
  async getCurrentScene() {
    const currentScene = await this.obsService.getCurrentScene();
    return { currentScene };
  }
}
