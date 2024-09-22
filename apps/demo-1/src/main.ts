import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MqttOptions, Transport } from '@nestjs/microservices';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { CustomEventPatternExplorer } from '@nestjs-dynamic-routes-and-listeners/custom-event-pattern';
import { CustomHttpMethodExplorer } from '@nestjs-dynamic-routes-and-listeners/custom-http-method';
import { AppModule } from './app/app.module';
import { AppController } from './app/app.controller';
import { EnvironmentVariables } from './app/environment-variables';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new FastifyAdapter({
      trustProxy: true,
    }),
    { bufferLogs: false, abortOnError: false },
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const configService =
    app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);
  const port = configService.get('PORT');

  app.get(CustomEventPatternExplorer).process([AppController]);
  app.connectMicroservice<MqttOptions>(
    {
      transport: Transport.MQTT,
      options: {
        url: configService.get('MQTT_URL'),
        subscribeOptions: {
          qos: 1,
        },
      },
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();

  app.get(CustomHttpMethodExplorer).process([AppController]);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
