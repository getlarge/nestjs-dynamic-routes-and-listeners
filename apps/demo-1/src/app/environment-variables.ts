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
    protocols: ['mqtt', 'mqtts'],
    require_tld: false,
  })
  MQTT_URL = 'mqtt://localhost:1883';

  @Expose()
  @IsString()
  HTTP_METHOD_PREFIX = 'http-demo-1';

  @Expose()
  @IsString()
  ROUTING_KEY_PREFIX = 'mqtt-demo-1';

  @Expose()
  @IsString()
  MESSAGE_PATTERN_PREFIX = 'mqtt-msg-demo-1';
}
