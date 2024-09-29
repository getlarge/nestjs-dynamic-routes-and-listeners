import { DynamicModule, Module, Provider } from '@nestjs/common';

import {
  CustomEventPatternModuleAsyncOptions,
  CustomEventPatternModuleOptions,
  ICustomEventPatternModuleOptions,
} from './custom-event-pattern.interface';
import { CustomEventPatternExplorer } from './custom-event-pattern.service';

@Module({})
export class CustomEventPatternModule {
  static forRoot(
    options: ICustomEventPatternModuleOptions,
    isGlobal?: boolean,
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
    isGlobal?: boolean,
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
    options: CustomEventPatternModuleAsyncOptions,
  ): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: CustomEventPatternModuleOptions,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
      ];
    }
    throw new Error('Invalid CustomEventPatternModuleAsyncOptions');
  }
}
