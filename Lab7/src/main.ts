import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // All routes start with /api  ->  e.g. GET /api/products
  app.setGlobalPrefix('api');

  // Lets the ShopNest HTML page (any origin in dev) call this API.
  // In production, replace `true` with your real frontend URL.
  app.enableCors({ origin: true });

  // Validates every DTO automatically.
  //  whitelist: strips unknown fields | transform: "5" -> 5 for numbers
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log('ShopNest API running on http://localhost:3000/api');
}
bootstrap();
