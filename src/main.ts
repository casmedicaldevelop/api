import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { UpstreamFailureFilter } from './common/filters/upstream-failure.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cookieParser());

  app.useGlobalFilters(new UpstreamFailureFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  await app.listen(parseInt(process.env.PORT || '3001', 10));
}
bootstrap();
