import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  readonly logger = new Logger(AppService.name);

  getData(id: string): { message: string } {
    this.logger.log(`Received request with id: ${id}`);
    return { message: 'Well done chaps!' };
  }

  onEvent(data: Record<string, unknown>): Record<string, unknown> {
    this.logger.log(`Received event with data: ${JSON.stringify(data)}`);
    return;
  }
}
