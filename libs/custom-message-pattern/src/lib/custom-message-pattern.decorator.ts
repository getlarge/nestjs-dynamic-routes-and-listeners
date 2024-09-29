import { DiscoveryService } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

export const CustomMessagePattern = DiscoveryService.createDecorator<{
  pattern: string;
  transport?: Transport;
}>();
