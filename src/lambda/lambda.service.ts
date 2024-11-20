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

      const response = await this.lambdaClient.send(command);

      if (response.FunctionError) {
        throw new Error(`Lambda function error: ${response.FunctionError}`);
      }

      // 응답 데이터 반환
      const responsePayload = response.Payload
        ? JSON.parse(Buffer.from(response.Payload).toString())
        : null;

      return responsePayload;
    } catch (error) {
      console.error('Error invoking Lambda:', error);
      throw new Error(`Error invoking Lambda: ${error.message}`);
    }
  }
}
