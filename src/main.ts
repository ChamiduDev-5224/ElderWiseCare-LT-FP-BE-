import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  AWS.config.update({
    httpOptions: {
      timeout: 30000,      // 30 seconds (adjust as needed)
      connectTimeout: 5000 // 5 seconds (adjust as needed)
    }
  });

  // the next two lines did the trick




  await app.listen(3000);
}
bootstrap();
