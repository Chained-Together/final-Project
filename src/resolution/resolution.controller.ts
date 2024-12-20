import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UpdateMetadataDto } from './dto/update-resolution.dto';
import { ResolutionService } from './resolution.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@ApiTags('동영상 메타데이터 API') // Swagger 그룹 태그
@Controller('api/video')
export class ResolutionController {
  constructor(private resolutionService: ResolutionService) {}

  @Post('update-metadata')
  @ApiOperation({
    summary: '동영상 메타데이터 업데이트',
    description: '동영상 URL 및 메타데이터를 사용하여 동영상 정보를 업데이트합니다.',
  })
  @ApiOkResponse({
    description: '동영상 메타데이터가 성공적으로 업데이트되었습니다.',
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청 데이터로 인해 메타데이터 업데이트가 실패했습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '서버에서 메타데이터 처리 중 오류가 발생했습니다.',
  })
  async updateMetadata(@Body() body: UpdateMetadataDto) {
    try {
      console.log('받은 데이터:', body);

      const { videoUrl, metadata } = body;

      console.log('Video URL:', videoUrl);
      console.log('Metadata:', metadata.videoCode);
      console.log('Metadata:', metadata.duration);
      console.log('Thumbnail:', metadata.thumbnail);

      return this.resolutionService.updateResolution(
        metadata.videoCode,
        metadata.duration,
        metadata.thumbnail,
        videoUrl,
      );
    } catch (error) {
      console.error('오류 발생:', error);
      throw new HttpException('Failed to process metadata', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
