import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Index ADMIN Panel')
    .setDescription('Index API description')
    .setVersion('1.0.0')
    .addSecurityRequirements('bearer', ['bearer'])
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe({whitelist:true, transform: true}));

  app.enableCors({
    origin: '*',
    methods: ['POST', 'PATCH','PUT', 'GET', 'DELETE']
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
