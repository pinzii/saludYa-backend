import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.setGlobalPrefix('api');

  // ── Swagger / OpenAPI ──────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('SaludYa API')
    .setDescription(
      'API REST del sistema de gestión y agendamiento de citas médicas SaludYa. ' +
        'Permite registrar usuarios, autenticarlos y gestionar el ciclo de vida completo de las citas médicas.',
    )
    .setVersion('1.0')
    .addTag('auth', 'Autenticación de usuarios')
    .addTag('users', 'Gestión de usuarios y perfiles')
    .addTag('appointments', 'Gestión de citas médicas')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  // ──────────────────────────────────────────────────────────

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
