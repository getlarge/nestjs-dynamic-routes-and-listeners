import type {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common/interfaces';

export interface ICustomMessagePatternModuleOptions {
  store: Map<string, string>;
  modules: Type<unknown>[];
}

export interface CustomMessagePatternModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: unknown[]
  ) =>
    | Promise<ICustomMessagePatternModuleOptions>
    | ICustomMessagePatternModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}

export class CustomMessagePatternModuleOptions
  implements ICustomMessagePatternModuleOptions
{
  constructor(
    public readonly store: Map<string, string>,
    public readonly modules: Type<unknown>[] = [],
  ) {}
}
