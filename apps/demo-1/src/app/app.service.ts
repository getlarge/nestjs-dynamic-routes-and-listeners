import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  readonly logger = new Logger(AppService.name);

  constructor(@Inject('MQTT_CLIENT') private readonly client: ClientProxy) {}

  getData(id: string): { message: string } {
    this.logger.log(`Received request with id: ${id}`);
    return { message: 'Well done chaps!' };
  }

  onEvent(data: Record<string, unknown>): void {
    this.logger.log(`Received event with data: ${JSON.stringify(data)}`);
    this.client.emit('reply', {
      message: 'Well done chaps!',
    });
  }
}
