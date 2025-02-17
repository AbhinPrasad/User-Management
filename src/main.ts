import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  const configService = app.get(ConfigService);
  const port = configService.get<string>('appConfig.port') ?? 3000;
  await app.listen(port);
  console.log(`server running on port: ${port}`);
}
bootstrap();
