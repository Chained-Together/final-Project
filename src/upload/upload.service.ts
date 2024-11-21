import { Inject, Injectable } from '@nestjs/common';
import { LambdaService } from 'src/lambda/lambda.service';

@Injectable()
export class UploadService {
  constructor(
    @Inject('LambdaService')
    private readonly lambdaService: LambdaService,
  ) {}

  async lambda(file: Express.Multer.File) {
    if (!file) {
      throw new Error('파일이 업로드되지 않았습니다.');
    }
  
    console.log('파일 이름:', file.originalname);
    console.log('파일 타입:', file.mimetype);
  
    // 파일이 제대로 업로드되었는지 확인
    if (!file.buffer) {
      throw new Error('파일의 버퍼를 읽을 수 없습니다.');
    }

    const lambdaPayload = {
      path: '/upload',
      httpMethod: 'POST',
      videoData: {
        fileName: file.originalname,
        fileType: file.mimetype,
        fileContent: file.buffer.toString('base64'), // 파일 데이터를 Base64로 변환
      },
    };

    // Lambda 호출
    const lambdaResponse = await this.lambdaService.invokeLambda(
      process.env.LAMBDA_FUNCTION_NAME,
      lambdaPayload,
    );

    return lambdaResponse;
  }
}
