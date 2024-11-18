import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setViewEngine('ejs');
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  // process.cwd()

  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`서버 실행 http://localhost:${process.env.PORT}`);
}
bootstrap();
