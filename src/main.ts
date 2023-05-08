import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  /*
  * adds a new method to the Date prototype called toISODate()
  * returns the date in ISO format (YYYY-MM-DD).
  */
  if (!Date.prototype['toISODate']) {
    Date.prototype['toISODate'] = function () {
      return this.getFullYear() + '-' + ('0' + (this.getMonth() + 1)).slice(-2) + '-' + ('0' + this.getDate()).slice(-2);
    };
  }

  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))

  const config = new DocumentBuilder()
    .setTitle('NorthExcel Task Documentation')
    .setDescription('Api documentation for the endpoints')
    .setVersion('1.0')
    .setContact('NorthExcel', 'https://www.north-excel.com', 'abd.saleh@north-excel.com')
    .addServer('http://localhost:' + port + '/')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.getHttpAdapter().get('/spec-json', (_, res) => res.json(document));
  await app.listen(port);
  console.log(`Nest is running on port: ${port}`);
}

bootstrap();
