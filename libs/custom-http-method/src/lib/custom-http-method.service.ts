//@ts-import
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
import { Reflector } from '@nestjs/core';

import {
  CUSTOM_HTTP_ROUTE_METADATA,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CustomHttpMethod,
  CustomHttpMethodOptions,
} from './custom-http-method.decorator';
import { CustomHttpMethodModuleOptions } from './custom-http-method.interface';

@Injectable()
export class CustomHttpMethodExplorer {
  readonly logger = new Logger(CustomHttpMethodExplorer.name);

  constructor(
    @Inject(CustomHttpMethodModuleOptions)
    private readonly options: CustomHttpMethodModuleOptions,
    private readonly reflector: Reflector
  ) {}

  substituteValues(input: string): string {
    return input.replace(
      /\$(\w+)/g,
      (match, p1) => this.options.store.get(p1) || match
    );
  }

  getMethodDecorator(method: string) {
    switch (method.toUpperCase()) {
      case 'GET':
        return Get();
      case 'POST':
        return Post();
      case 'PUT':
        return Put();
      case 'DELETE':
        return Delete();
      case 'PATCH':
        return Patch();
      case 'OPTIONS':
        return Options();
      case 'HEAD':
        return Head();
      default:
        return Get();
    }
  }

  /**
   * This code is used in combination with the CustomHttpMethod decorator to enable dynamic HTTP routes.
   * The process method will scan and search for code that uses the decorator and dynamically substitute the template variables by values from the CustomHttpMethodModuleOptions.
   * After substitution, it decorates the method with the HTTP method (e.g. @Get, @Post, etc) from NestJS.
   *
   * @example Usage:
   * ```js
   * CustomHttpMethod('GET', '$ROUTING_KEY_PREFIX.*.#') // $ROUTING_KEY_PREFIX will be substituted by the value from the CustomHttpMethodModuleOptions
   * if the value of ROUTING_KEY_PREFIX is 'root', the final path will be 'root.*.#'
   *```
   *
   * @see {@link CustomHttpMethod}
   */
  process(types: Type[]) {
    for (const type of types) {
      this.logger.log(`${type.name}:`);
      const propNames = Object.getOwnPropertyNames(type.prototype);
      for (const prop of propNames) {
        const handler = Reflect.get(type.prototype, prop);
        const { method, path } =
          this.reflector.get<CustomHttpMethodOptions>(
            CUSTOM_HTTP_ROUTE_METADATA,
            handler
          ) ?? {};
        if (!method) continue;

        const fulfilledPath = this.substituteValues(path);
        const decorator = this.getMethodDecorator(method);
        this.logger.log(`Mapped {${method} ${fulfilledPath}} route`);
        Reflect.decorate(
          [decorator],
          type.prototype,
          prop,
          Reflect.getOwnPropertyDescriptor(type.prototype, prop)
        );
      }
    }
  }
}
