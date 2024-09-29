import { Inject, Injectable, Logger, Type } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { CustomMessagePattern } from './custom-message-pattern.decorator';
import { MessagePattern } from '@nestjs/microservices';
import { CustomMessagePatternModuleOptions } from './custom-message-pattern.interface';

@Injectable()
export class CustomMessagePatternExplorer {
  readonly logger = new Logger(CustomMessagePatternExplorer.name);

  constructor(
    @Inject(CustomMessagePatternModuleOptions)
    private readonly options: CustomMessagePatternModuleOptions,
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
        const metadata = this.discoveryService.getMetadataByDecorator(
          CustomMessagePattern,
          wrapper,
          handler,
        );
        if (!metadata) {
          continue;
        }
        const { pattern, transport } = metadata;
        const fulfilledPattern = this.substituteValues(pattern);
        this.logger.log(`Mapped {${fulfilledPattern}} listener`);
        Reflect.decorate(
          [MessagePattern(fulfilledPattern, transport)],
          wrapper.metatype.prototype,
          handler,
          Reflect.getOwnPropertyDescriptor(wrapper.metatype.prototype, handler),
        );
      }
    }
  }
}
