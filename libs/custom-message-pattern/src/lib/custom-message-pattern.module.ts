import { DynamicModule, Module, Provider } from '@nestjs/common';

import {
  CustomMessagePatternModuleAsyncOptions,
  CustomMessagePatternModuleOptions,
  ICustomMessagePatternModuleOptions,
} from './custom-message-pattern.interface';
import { CustomMessagePatternExplorer } from './custom-message-pattern.service';
import { DiscoveryModule } from '@nestjs/core';

@Module({})
export class CustomMessagePatternModule {
  static forRoot(
    options: ICustomMessagePatternModuleOptions,
    isGlobal?: boolean,
  ): DynamicModule {
    return {
      module: CustomMessagePatternModule,
      imports: [DiscoveryModule],
      providers: [
        { provide: CustomMessagePatternModuleOptions, useValue: options },
        CustomMessagePatternExplorer,
      ],
      exports: [
        CustomMessagePatternModuleOptions,
        CustomMessagePatternExplorer,
      ],
      global: isGlobal,
    };
  }

  static forRootAsync(
    options: CustomMessagePatternModuleAsyncOptions,
    isGlobal?: boolean,
  ): DynamicModule {
    return {
      module: CustomMessagePatternModule,
      imports: options.imports
        ? [...options.imports, DiscoveryModule]
        : [DiscoveryModule],
      providers: [
        ...this.createAsyncProviders(options),
        CustomMessagePatternExplorer,
      ],
      exports: [
        CustomMessagePatternModuleOptions,
        CustomMessagePatternExplorer,
      ],
      global: isGlobal,
    };
  }

  private static createAsyncProviders(
    options: CustomMessagePatternModuleAsyncOptions,
  ): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: CustomMessagePatternModuleOptions,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
      ];
    }
    throw new Error('Invalid CustomMessagePatternModuleAsyncOptions');
  }
}
