import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston'
import { winstonConfig } from './configs/winston.configs'

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig)
  const app = await NestFactory.create(AppModule, { logger });
  await app.listen(process.env.API_PORT || 3000)
}
bootstrap()