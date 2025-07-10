import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
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
