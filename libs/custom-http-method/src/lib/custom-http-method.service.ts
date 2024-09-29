import {
  Delete,
  Get,
  Head,
  Inject,
  Injectable,
  Logger,
  Options,
  Patch,
  Post,
  Put,
  Type,
} from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';

import { CustomHttpMethod } from './custom-http-method.decorator';
import { CustomHttpMethodModuleOptions } from './custom-http-method.interface';

@Injectable()
export class CustomHttpMethodExplorer {
  readonly logger = new Logger(CustomHttpMethodExplorer.name);

  constructor(
    @Inject(CustomHttpMethodModuleOptions)
    private readonly options: CustomHttpMethodModuleOptions,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {
    this.process();
  }

  get store(): Map<string, string> {
    return this.options.store;
  }

  get modules(): Type<unknown>[] {
    return this.options.modules;
  }

  private substituteValues(input: string): string {
    return input.replace(
      /\$(\w+)/g,
      (match, p1) => this.store.get(p1) || match,
    );
  }

  private getMethodDecorator(
    method: string,
  ): (path: string | string[]) => MethodDecorator {
    switch (method.toUpperCase()) {
      case 'GET':
        return Get;
      case 'POST':
        return Post;
      case 'PUT':
        return Put;
      case 'DELETE':
        return Delete;
      case 'PATCH':
        return Patch;
      case 'OPTIONS':
        return Options;
      case 'HEAD':
        return Head;
      default:
        return Get;
    }
  }

  process() {
    const instances = this.discoveryService.getControllers({
      include: this.modules,
    });
    for (const wrapper of instances) {
      const handlers = this.metadataScanner.getAllMethodNames(
        wrapper.metatype.prototype,
      );
      this.logger.log(`${wrapper.name}:`);
      for (const handler of handlers) {
        //! great we even get type information here!
        const metadata = this.discoveryService.getMetadataByDecorator(
          CustomHttpMethod,
          wrapper,
          handler,
        );
        if (!metadata) {
          continue;
        }
        const { method, path } = metadata;
        const fulfilledPath = this.substituteValues(path);
        const decorator = this.getMethodDecorator(method);
        this.logger.log(`Mapped {${method} ${fulfilledPath}} route`);
        Reflect.decorate(
          [decorator(fulfilledPath)],
          wrapper.metatype.prototype,
          handler,
          Reflect.getOwnPropertyDescriptor(wrapper.metatype.prototype, handler),
        );
      }
    }
  }
}
