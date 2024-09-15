import { DynamicModule, Module, Provider, Type } from '@nestjs/common';

import {
  CustomEventPatternModuleAsyncOptions,
  CustomEventPatternModuleOptions,
  CustomEventPatternModuleOptionsFactory,
  ICustomEventPatternModuleOptions,
} from './custom-event-pattern.interface';
import { CustomEventPatternExplorer } from './custom-event-pattern.service';

@Module({})
export class CustomEventPatternModule {
  static forRoot(
    options: ICustomEventPatternModuleOptions,
    isGlobal?: boolean
  ): DynamicModule {
    return {
      module: CustomEventPatternModule,
      imports: [],
      providers: [
        { provide: CustomEventPatternModuleOptions, useValue: options },
        CustomEventPatternExplorer,
      ],
      exports: [CustomEventPatternModuleOptions, CustomEventPatternExplorer],
      global: isGlobal,
    };
  }

  static forRootAsync(
    options: CustomEventPatternModuleAsyncOptions,
    isGlobal?: boolean
  ): DynamicModule {
    return {
      module: CustomEventPatternModule,
      imports: options.imports ? [...options.imports] : [],
      providers: [
        ...this.createAsyncProviders(options),
        CustomEventPatternExplorer,
      ],
      exports: [CustomEventPatternModuleOptions, CustomEventPatternExplorer],
      global: isGlobal,
    };
  }

  private static createAsyncProviders(
    options: CustomEventPatternModuleAsyncOptions
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
    throw new Error('Invalid CustomEventPatternModuleAsyncOptions');
  }

  private static createAsyncOptionsProvider(
    options: CustomEventPatternModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CustomEventPatternModuleOptions,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    }
    if (!options.useExisting && !options.useClass) {
      throw new Error('Invalid OryAuthenticationModuleAsyncOptions');
    }
    return {
      provide: CustomEventPatternModuleOptions,
      useFactory: (optionsFactory: CustomEventPatternModuleOptionsFactory) =>
        optionsFactory.createOptions(),
      inject: [
        (options.useExisting ??
          options.useClass) as Type<CustomEventPatternModuleOptionsFactory>,
      ],
    };
  }
}
