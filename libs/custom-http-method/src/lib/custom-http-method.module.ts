import { DynamicModule, Module, Provider, Type } from '@nestjs/common';

import {
  CustomHttpMethodModuleAsyncOptions,
  CustomHttpMethodModuleOptions,
  CustomHttpMethodModuleOptionsFactory,
  ICustomHttpMethodModuleOptions,
} from './custom-http-method.interface';
import { CustomHttpMethodExplorer } from './custom-http-method.service';

@Module({})
export class CustomHttpMethodModule {
  static forRoot(
    options: ICustomHttpMethodModuleOptions,
    isGlobal?: boolean
  ): DynamicModule {
    return {
      module: CustomHttpMethodModule,
      imports: [],
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
    isGlobal?: boolean
  ): DynamicModule {
    return {
      module: CustomHttpMethodModule,
      imports: options.imports ? [...options.imports] : [],
      providers: [
        ...this.createAsyncProviders(options),
        CustomHttpMethodExplorer,
      ],
      exports: [CustomHttpMethodModuleOptions, CustomHttpMethodExplorer],
      global: isGlobal,
    };
  }

  private static createAsyncProviders(
    options: CustomHttpMethodModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    if (options.useClass) {
      return [
        this.createAsyncOptionsProvider(options),
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ];
    }
    throw new Error('Invalid CustomHttpMethodModuleAsyncOptions');
  }

  private static createAsyncOptionsProvider(
    options: CustomHttpMethodModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CustomHttpMethodModuleOptions,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    }
    if (!options.useExisting && !options.useClass) {
      throw new Error('Invalid OryAuthenticationModuleAsyncOptions');
    }
    return {
      provide: CustomHttpMethodModuleOptions,
      useFactory: (optionsFactory: CustomHttpMethodModuleOptionsFactory) =>
        optionsFactory.createOptions(),
      inject: [
        (options.useExisting ??
          options.useClass) as Type<CustomHttpMethodModuleOptionsFactory>,
      ],
    };
  }
}
