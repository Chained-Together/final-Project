import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.set('view engine', 'ejs');
  expressApp.set('views', join(__dirname, '..', 'views'));
  console.log(join(process.cwd(), 'views'));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3001);
  Logger.log(`서버 실행 http://localhost:${process.env.PORT}`);
}
bootstrap();
