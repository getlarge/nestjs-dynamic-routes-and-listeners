import { Expose } from 'class-transformer';
import { IsInt, IsPositive, IsString, IsUrl, Min } from 'class-validator';

export class EnvironmentVariables {
  @Expose()
  @IsInt()
  @IsPositive()
  @Min(1024)
  PORT = 3000;

  @Expose()
  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
    protocols: ['amqp', 'amqps'],
    require_tld: false,
  })
  RMQ_URL = 'amqp://localhost:5672';

  @Expose()
  @IsString()
  HTTP_METHOD_PREFIX = 'api';

  @Expose()
  @IsString()
  ROUTING_KEY_PREFIX = 'root';
}
