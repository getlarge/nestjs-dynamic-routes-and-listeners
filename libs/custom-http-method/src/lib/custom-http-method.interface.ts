import type {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common/interfaces';

export interface ICustomHttpMethodModuleOptions {
  store: Map<string, string>;
}

export interface CustomHttpMethodModuleOptionsFactory {
  createOptions():
    | Promise<ICustomHttpMethodModuleOptions>
    | ICustomHttpMethodModuleOptions;
}

export interface CustomHttpMethodModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<CustomHttpMethodModuleOptionsFactory>;
  useClass?: Type<CustomHttpMethodModuleOptionsFactory>;
  useFactory?: (
    ...args: unknown[]
  ) =>
    | Promise<ICustomHttpMethodModuleOptions>
    | ICustomHttpMethodModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}

export class CustomHttpMethodModuleOptions
  implements ICustomHttpMethodModuleOptions
{
  constructor(public readonly store: Map<string, string>) {}
}
