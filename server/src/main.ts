import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req: Request, res: Response, next: NextFunction) => {
    // console.log('--- NOVI ZAHTEV ---');
    // console.log('Vreme:', new Date().toISOString());
    // console.log('Metoda:', req.method);
    // console.log('URL:', req.originalUrl);
    // console.log('Origin Header:', req.headers.origin);
    // console.log('--------------------');
    
    next();
  });
  app.enableCors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();