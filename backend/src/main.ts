import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AddSwagger } from './utility';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // DTO Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  // Handle CORS
  app.enableCors();
  // Add Swagger
  await AddSwagger(app);

  const configService = app.get(ConfigService);
  await app.listen(configService.get('port'), configService.get('host'), () => {
    console.log(
      `Server starting on ${configService.get('host')}:${configService.get(
        'port',
      )}`,
    );
  });
}
bootstrap();
