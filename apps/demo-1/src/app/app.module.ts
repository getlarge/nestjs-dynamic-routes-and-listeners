import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomEventPatternModule } from '@nestjs-dynamic-routes-and-listeners/custom-event-pattern';
import { CustomHttpMethodModule } from '@nestjs-dynamic-routes-and-listeners/custom-http-method';
import { EnvironmentVariables } from './environment-variables';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validate: (config) => {
        const validatedConfig = plainToInstance(EnvironmentVariables, config, {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        });
        const errors = validateSync(validatedConfig, {
          skipMissingProperties: false,
        });
        if (errors.length > 0) {
          throw new Error(errors.toString());
        }
        return validatedConfig;
      },
    }),
    ClientsModule.registerAsync([
      {
        name: 'MQTT_CLIENT',
        inject: [ConfigService],
        useFactory: (
          configService: ConfigService<EnvironmentVariables, true>,
        ) => {
          return {
            transport: Transport.MQTT,
            options: {
              url: configService.get('MQTT_URL'),
            },
          };
        },
      },
    ]),
    CustomEventPatternModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => {
        const store = new Map<string, string>();
        store.set(
          'ROUTING_KEY_PREFIX',
          configService.get('ROUTING_KEY_PREFIX'),
        );
        return { store };
      },
    }),
    CustomHttpMethodModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => {
        const store = new Map<string, string>();
        store.set(
          'HTTP_METHOD_PREFIX',
          configService.get('HTTP_METHOD_PREFIX'),
        );
        return { store };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
