import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import * as dotenv from 'dotenv';
import * as express from 'express';

const envFile = process.env.NODE_ENV === 'production' ? '.env' : 'development.env';
dotenv.config({ path: envFile });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
      },
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const expressApp = app.getHttpAdapter().getInstance();

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public',
  });
  expressApp.set('view engine', 'ejs');
  expressApp.set('views', join(__dirname, '..', 'views'));
  console.log(join(process.cwd(), 'views'));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`서버 실행 http://localhost:${process.env.PORT}`);
}
bootstrap();
