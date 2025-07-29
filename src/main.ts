import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: configService.get('NODE_ENV') === 'production',
    }),
  );

  const docsConfig = new DocumentBuilder()
    .setTitle('SHG Backend API')
    .setDescription('API service for online SHG services')
    .setVersion(configService.get('npm_package_version', '0.0.0'))
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('docs', app, documentFactory());

  await app.listen(configService.get('PORT', 3000));
}
bootstrap();
