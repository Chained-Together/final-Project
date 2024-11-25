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

      // body에서 데이터 추출
      const { highResolutionUrl, lowResolutionUrl, metadata } = body;

      // 받은 데이터를 처리하는 로직
      console.log('High Resolution URL:', highResolutionUrl);
      console.log('Low Resolution URL:', lowResolutionUrl);
      console.log('Metadata:', metadata.videoCode);
      console.log('Metadata:', metadata.duration);

      return this.resolutionService.updateResolution(
        metadata.videoCode,
        metadata.duration,
        highResolutionUrl,
        lowResolutionUrl,
      );
    } catch (error) {
      console.error('오류 발생:', error);
      throw new HttpException('Failed to process metadata', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
}
