import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 5050; // ✅ Render sets PORT env variable
  await app.listen(port);
  console.log(`🚀 App running on http://localhost:${port}`);
}
bootstrap();
