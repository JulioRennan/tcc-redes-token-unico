import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import admin from 'firebase-admin';
import serviceAccount from '../tcc-admin';
async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
      projectId: serviceAccount.project_id,
    }),
  });
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
