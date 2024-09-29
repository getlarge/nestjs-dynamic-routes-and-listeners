import { Controller, Param } from '@nestjs/common';
import { Payload, Transport } from '@nestjs/microservices';

import { AppService } from './app.service';
import { CustomEventPattern } from '@nestjs-dynamic-routes-and-listeners/custom-event-pattern';
import { CustomHttpMethod } from '@nestjs-dynamic-routes-and-listeners/custom-http-method';
import { CustomMessagePattern } from '@nestjs-dynamic-routes-and-listeners/custom-message-pattern';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @CustomHttpMethod({ method: 'GET', path: '$HTTP_METHOD_PREFIX/:id' })
  getData(@Param('id') id: string) {
    return this.appService.getData(id);
  }

  @CustomEventPattern('$ROUTING_KEY_PREFIX/+')
  onEvent(@Payload() data: Record<string, unknown>) {
    return this.appService.onEvent(data);
  }

  @CustomMessagePattern({
    pattern: '$MESSAGE_PATTERN_PREFIX/+',
    transport: Transport.MQTT,
  })
  onMessage(@Payload() data: Record<string, unknown>) {
    return this.appService.onMessage(data);
  }
}
