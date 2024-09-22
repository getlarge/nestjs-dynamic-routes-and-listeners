import { Inject, Injectable, Logger, Type } from '@nestjs/common';
import { EventPattern, Transport } from '@nestjs/microservices';

import {
  CUSTOM_EVENT_NAME_METADATA,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CustomEventPattern,
} from './custom-event-pattern.decorator';
import { CustomEventPatternModuleOptions } from './custom-event-pattern.interface';

@Injectable()
export class CustomEventPatternExplorer {
  readonly logger = new Logger(CustomEventPatternExplorer.name);

  constructor(
    @Inject(CustomEventPatternModuleOptions)
    private readonly options: CustomEventPatternModuleOptions,
  ) {}

  substituteValues(input: string): string {
    return input.replace(
      /\$(\w+)/g,
      (match, p1) => this.options.store.get(p1) || match,
    );
  }

  /**
   * This code is used in combination with the CustomEventPattern decorator to enable dynamic topics for RabbitMQ.
   * The process method will scan and search for code that uses the decorator and dynamically substitute the template variables by values from the CustomEventPatternModuleOptions.
   * After substitution, it decorates the method with the EventPattern from NestJS.
   *
   * @example Usage:
   * ```js
   * CustomEventPattern('$ROUTING_KEY_PREFIX.*.#') // $ROUTING_KEY_PREFIX will be substituted by the value from the CustomEventPatternModuleOptions
   * if the value of ROUTING_KEY_PREFIX is 'root', the final topic will be 'root.*.#'
   *```
   *
   * @see {@link CustomEventPattern}
   */
  process(types: Type[]) {
    for (const type of types) {
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
