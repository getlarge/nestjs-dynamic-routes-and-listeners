import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { CustomEventPatternExplorer } from '@nestjs-dynamic-routes-and-listeners/custom-event-pattern';
import { CustomHttpMethodExplorer } from '@nestjs-dynamic-routes-and-listeners/custom-http-method';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { AmqpOptions, AmqpServer } from '@getlarge/nestjs-tools-amqp-transport';
import { AppController } from './app/app.controller';
import { EnvironmentVariables } from './app/environment-variables';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new FastifyAdapter({
      trustProxy: true,
    }),
    { bufferLogs: false, abortOnError: false, snapshot: true }
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  Logger.log('Setting up AMQP consumers');
  const configService =
    app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  const internalEventConsumerOptions = {
    urls: [configService.get('RMQ_URL') as string],
    persistent: true,
    queue: 'internal-events',
    queueOptions: {
      durable: false,
      autoDelete: true,
    },
  } satisfies AmqpOptions;

  /**
   * !IMPORTANT
   * This needs to be done before connecting the microservices
   *
   * CustomEventPatternExplorer will process the CustomEventPattern decorators and create the event handlers
   */
  app.get(CustomEventPatternExplorer).process([AppController]);
  app.connectMicroservice(
    { strategy: new AmqpServer(internalEventConsumerOptions) },
    { inheritAppConfig: true }
  );

  /**
   * !IMPORTANT
   * This needs to be done before starting the application HTTP server
   *
   * CustomHttpMethodExplorer will process the CustomHttpMethod decorators and create the route handlers
   */
  app.get(CustomHttpMethodExplorer).process([AppController]);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
