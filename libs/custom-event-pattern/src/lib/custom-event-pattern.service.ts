import { Inject, Injectable, Logger, Type } from '@nestjs/common';
import { EventPattern, Transport } from '@nestjs/microservices';

import { CUSTOM_EVENT_NAME_METADATA } from './custom-event-pattern.decorator';
import { CustomEventPatternModuleOptions } from './custom-event-pattern.interface';

@Injectable()
export class CustomEventPatternExplorer {
  readonly logger = new Logger(CustomEventPatternExplorer.name);

  constructor(
    @Inject(CustomEventPatternModuleOptions)
    private readonly options: CustomEventPatternModuleOptions,
  ) {
    this.process();
  }

  get store() {
    return this.options.store;
  }

  get controllers() {
    return this.options.controllers ?? [];
  }

  private substituteValues(input: string): string {
    return input.replace(
      /\$(\w+)/g,
      (match, p1) => this.store.get(p1) || match,
    );
  }

  process() {
    for (const type of this.controllers) {
      this.logger.log(`${type.name}:`);
      const propNames = Object.getOwnPropertyNames(type.prototype);
      for (const prop of propNames) {
        const handler = Reflect.get(type.prototype, prop);
        const dynamicTopic = Reflect.getMetadata(
          CUSTOM_EVENT_NAME_METADATA,
          handler,
        );
        if (!dynamicTopic) continue;
        const topic = this.substituteValues(dynamicTopic);
        this.logger.log(`Mapped {${topic}} listener`);
        Reflect.decorate(
          [EventPattern(topic, Transport.MQTT)],
          type.prototype,
          prop,
          Reflect.getOwnPropertyDescriptor(type.prototype, prop),
        );
      }
    }
  }
}
