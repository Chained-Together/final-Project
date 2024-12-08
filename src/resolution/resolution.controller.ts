import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateMetadataDto } from './dto/update-resolution.dto';
import { ResolutionService } from './resolution.service';

@Controller('api/video')
export class ResolutionController {
  constructor(private resolutionService: ResolutionService) {}

  @Post('update-metadata')
  async updateMetadata(@Body() body: UpdateMetadataDto) {
    try {
      console.log('받은 데이터:', body);

      const { videoUrl, metadata } = body;

      console.log('Video URL:', videoUrl);
      console.log('Metadata:', metadata.videoCode);
      console.log('Metadata:', metadata.duration);

      return this.resolutionService.updateResolution(
        metadata.videoCode,
        metadata.duration,
        videoUrl,
      );
    } catch (error) {
      console.error('오류 발생:', error);
      throw new HttpException('Failed to process metadata', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
