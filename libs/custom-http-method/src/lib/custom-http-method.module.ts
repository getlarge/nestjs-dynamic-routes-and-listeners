import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import {
  CustomHttpMethodModuleAsyncOptions,
  CustomHttpMethodModuleOptions,
  ICustomHttpMethodModuleOptions,
} from './custom-http-method.interface';
import { CustomHttpMethodExplorer } from './custom-http-method.service';

@Module({})
export class CustomHttpMethodModule {
  static forRoot(
    options: ICustomHttpMethodModuleOptions,
    isGlobal?: boolean,
  ): DynamicModule {
    return {
      module: CustomHttpMethodModule,
      imports: [DiscoveryModule],
      providers: [
        { provide: CustomHttpMethodModuleOptions, useValue: options },
        CustomHttpMethodExplorer,
      ],
      exports: [CustomHttpMethodModuleOptions, CustomHttpMethodExplorer],
      global: isGlobal,
    };
  }

  static forRootAsync(
    options: CustomHttpMethodModuleAsyncOptions,
    isGlobal?: boolean,
  ): DynamicModule {
    return {
      module: CustomHttpMethodModule,
      imports: options.imports
        ? [...options.imports, DiscoveryModule]
        : [DiscoveryModule],
      providers: [
        ...this.createAsyncProviders(options),
        CustomHttpMethodExplorer,
      ],
      exports: [CustomHttpMethodModuleOptions, CustomHttpMethodExplorer],
      global: isGlobal,
    };
  }

  private static createAsyncProviders(
    options: CustomHttpMethodModuleAsyncOptions,
  ): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: CustomHttpMethodModuleOptions,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
      ];
    }
    throw new Error('Invalid CustomHttpMethodModuleAsyncOptions');
  }
}
