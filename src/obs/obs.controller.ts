import { Controller, Get, Post } from '@nestjs/common';
import { ObsService } from './obs.service';

@Controller('obs')
export class ObsController {
  constructor(private readonly obsService: ObsService) {}

  // 스트리밍 시작 API
  @Post('start-streaming')
  async startStreaming() {
    await this.obsService.startStreaming();
    return { message: 'Streaming started' };
  }

  // 스트리밍 종료 API
  @Post('stop-streaming')
  async stopStreaming() {
    await this.obsService.stopStreaming();
    return { message: 'Streaming stopped' };
  }

  // 스트리밍 상태 조회 API
  @Get('streaming-status')
  async getStreamingStatus() {
    const status = await this.obsService.getStreamingStatus();
    return { status };
  }

  // 장면 목록 조회 API
  @Get('getSceneList')
  async getSceneList() {
    const sceneList = await this.obsService.getSceneList();
    return { scenes: sceneList };
  }

  // 현재 방송 중인 장면 조회 API
  @Get('getCurrentScene')
  async getCurrentScene() {
    const currentScene = await this.obsService.getCurrentScene();
    return { currentScene };
  }
}
