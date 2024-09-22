import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Method } from 'axios';

export const CUSTOM_HTTP_ROUTE_METADATA = '__custom_http_route__';

export type CustomHttpMethodOptions = {
  method: Method;
  path: string;
};

/**
 * The decorator takes a string argument with a template string that is a dynamic topic (e.g. $ROUTING_KEY_PREFIX.$BASE_TOPIC.# => root.my_app.#).
 */
export function CustomHttpMethod(
  method: Method,
  path: string,
): MethodDecorator {
  return applyDecorators(
    SetMetadata(CUSTOM_HTTP_ROUTE_METADATA, {
      method: method.toUpperCase(),
      path,
    }),
  );
}
