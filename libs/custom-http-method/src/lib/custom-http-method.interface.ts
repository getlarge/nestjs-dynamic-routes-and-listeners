import type {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common/interfaces';

export interface ICustomHttpMethodModuleOptions {
  store: Map<string, string>;
  modules: Type<unknown>[];
}

export interface CustomHttpMethodModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: unknown[]
  ) => Promise<ICustomHttpMethodModuleOptions> | ICustomHttpMethodModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}

export class CustomHttpMethodModuleOptions
  implements ICustomHttpMethodModuleOptions
{
  constructor(
    public readonly store: Map<string, string>,
    public readonly modules: Type<unknown>[] = [],
  ) {}
}
