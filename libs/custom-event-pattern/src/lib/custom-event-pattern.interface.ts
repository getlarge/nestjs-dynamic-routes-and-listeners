import type {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common/interfaces';

export interface ICustomEventPatternModuleOptions {
  store: Map<string, string>;
  controllers: Type<unknown>[];
}

export interface CustomEventPatternModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
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
  constructor(
    public readonly store: Map<string, string>,
    public readonly controllers: Type<unknown>[],
  ) {}
}
