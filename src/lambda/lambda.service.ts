import { Injectable } from '@nestjs/common';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

@Injectable()
export class LambdaService {
  private lambdaClient: LambdaClient;

  constructor() {
    this.lambdaClient = new LambdaClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async invokeLambda(functionName: string, payload: Record<string, any>) {
    try {
      const command = new InvokeCommand({
        FunctionName: functionName,
        Payload: Buffer.from(JSON.stringify(payload)), // 요청 데이터를 Buffer 형식으로 전달
      });

      console.log(100,functionName);

      // console.log(command);

      const response = await this.lambdaClient.send(command);

      console.log(0, response);

      if (response.FunctionError) {
        throw new Error(`Lambda function error: ${response.FunctionError}`);
      }

      console.log(1, response.Payload);
      // 응답 데이터 반환
      const responsePayload = response.Payload
        ? JSON.parse(Buffer.from(response.Payload).toString('utf-8'))
        : null;

      console.log(2, responsePayload);
      console.log('Decoded String:', new TextDecoder('utf-8').decode(response.Payload));

      return responsePayload;
    } catch (error) {
      console.error('Error invoking Lambda:', error);
      throw new Error(`Error invoking Lambda: ${error.message}`);
    }
  }
}
