import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật CORS
  app.enableCors();

  await app.listen(3001);
  console.log('NestJS Server đang chạy tại http://localhost:3001');
}
bootstrap();
