import { applyDecorators, SetMetadata } from '@nestjs/common';

export const CUSTOM_EVENT_NAME_METADATA = '__custom_event_name__';

/**
 * The decorator takes a string argument with a template string that is a dynamic topic (e.g. $ROUTING_KEY_PREFIX.$BASE_TOPIC.# => root.my_app.#).
 */
export function CustomEventPattern(dynamicTopic: string): MethodDecorator {
  return applyDecorators(SetMetadata(CUSTOM_EVENT_NAME_METADATA, dynamicTopic));
}
