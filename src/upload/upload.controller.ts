import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/video/multer.option';
import { UploadService } from './upload.service';

@Controller('lambda')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async lambda(@UploadedFile() file: Express.Multer.File) {
    console.log(file);

    if (!file) {
      throw new Error('File not uploaded');
    }

    return this.uploadService.lambda(file);
  }
}
