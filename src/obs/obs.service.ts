import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { OBSWebSocket } from 'obs-websocket-js';

@Injectable()
export class ObsService implements OnModuleInit, OnModuleDestroy {
  private obs: OBSWebSocket;

  constructor() {
    this.obs = new OBSWebSocket();
  }

  async onModuleInit() {
    try {
      await this.obs.connect('ws://localhost:4455', 'oydCbzTsb5pqy0dT');
      console.log('Connected to OBS WebSocket');
    } catch (error) {
      console.error('Failed to connect to OBS WebSocket:', error);
      throw new Error('OBS WebSocket connection failed');
    }
  }

  async onModuleDestroy() {
    try {
      await this.obs.disconnect();
      console.log('Disconnected from OBS WebSocket');
    } catch (error) {
      console.error('Error disconnecting from OBS WebSocket:', error);
    }
  }


  async startStreaming(): Promise<void> {
    try {
      const response = await this.obs.call('StartStream');
      console.log('Streaming started', response);
    } catch (error) {
      console.error('Error starting streaming:', error);
      throw new Error('Error starting streaming');
    }
  }

  async stopStreaming(): Promise<void> {
    try {
      const response = await this.obs.call('StopStream');
      console.log('Streaming stopped', response);
    } catch (error) {
      console.error('Error stopping streaming:', error);
      throw new Error('Error stopping streaming');
    }
  }

 
  async getStreamingStatus(): Promise<any> {
    try {
      const status = await this.obs.call('GetStreamStatus');
      console.log('Streaming status:', status);
      return status;
    } catch (error) {
      console.error('Error fetching streaming status:', error);
      throw new Error('Error fetching streaming status');
    }
  }


  async getSceneList(): Promise<any[]> {
    try {
      const data = await this.obs.call('GetSceneList');
      console.log(`${data.scenes.length} Available Scenes!`);
      return data.scenes; 
    } catch (error) {
      console.error('Error fetching scene list:', error);
      throw new Error('Error fetching scene list');
    }
  }


  async getCurrentScene(): Promise<any> {
    try {
      const currentScene = await this.obs.call('GetCurrentPreviewScene');
      console.log(`Current Scene: ${currentScene.sceneName}`);
      return currentScene; 
    } catch (error) {
      console.error('Error fetching current scene:', error);
      throw new Error('Error fetching current scene');
    }
  }
}