import { DiscoveryService } from '@nestjs/core';
import type { Method } from 'axios';

export const CustomHttpMethod = DiscoveryService.createDecorator<{
  method: Method;
  path: string;
}>();
