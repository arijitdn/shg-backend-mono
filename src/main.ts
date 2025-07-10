import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  const docsConfig = new DocumentBuilder()
    .setTitle('SHG Backend API')
    .setDescription('API service for online SHG services')
    .setVersion(configService.get('npm_package_version', '0.0.0'))
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('api/docs', app, documentFactory());

  await app.listen(configService.get('PORT', 3000));
}
bootstrap();
