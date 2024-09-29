export const CUSTOM_EVENT_NAME_METADATA = '__custom_event_name__';



export function CustomEventPattern(dynamicTopic: string): MethodDecorator {
  return (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      CUSTOM_EVENT_NAME_METADATA,
      dynamicTopic,
      descriptor.value,
    );
    return descriptor;
  };
}
