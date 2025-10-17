// src/main.ts
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { CommandModule } from '../modules/command.module';
import { QueryModule } from '../modules/query.module';

@Module({
  imports: [CommandModule, QueryModule],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // optional
  await app.listen(3000);
  console.log('API Gateway running on http://localhost:3000');
}
bootstrap();
