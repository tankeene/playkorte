import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  });

  const port = Number(process.env.PORT) || 3001;
  const host = process.env.HOST || '127.0.0.1'; // force IPv4
  await app.listen(port, host);
  console.log(`API listening on http://${host}:${port}`);
}
bootstrap();
