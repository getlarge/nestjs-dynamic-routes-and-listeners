import { Controller, Param } from '@nestjs/common';

import { AppService } from './app.service';
import { CustomEventPattern } from '@nestjs-dynamic-routes-and-listeners/custom-event-pattern';
import { CustomHttpMethod } from '@nestjs-dynamic-routes-and-listeners/custom-http-method';
import { Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @CustomHttpMethod('GET', '$HTTP_METHOD_PREFIX/:id')
  getData(@Param('id') id: string) {
    return this.appService.getData(id);
  }

  @CustomEventPattern('$ROUTING_KEY_PREFIX.*.#')
  onEvent(@Payload() data: Record<string, unknown>) {
    return this.appService.onEvent(data);
  }
}
