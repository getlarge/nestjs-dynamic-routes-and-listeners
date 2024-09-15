import type {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common/interfaces';

export interface ICustomEventPatternModuleOptions {
  store: Map<string, string>;
}

export interface CustomEventPatternModuleOptionsFactory {
  createOptions():
    | Promise<ICustomEventPatternModuleOptions>
    | ICustomEventPatternModuleOptions;
}

export interface CustomEventPatternModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<CustomEventPatternModuleOptionsFactory>;
  useClass?: Type<CustomEventPatternModuleOptionsFactory>;
  useFactory?: (
    ...args: unknown[]
  ) =>
    | Promise<ICustomEventPatternModuleOptions>
    | ICustomEventPatternModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}

export class CustomEventPatternModuleOptions
  implements ICustomEventPatternModuleOptions
{
  constructor(public readonly store: Map<string, string>) {}
}
