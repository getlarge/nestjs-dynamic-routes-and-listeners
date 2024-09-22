import { connectAsync, MqttClient, MqttClientEventCallbacks } from 'mqtt';
import { randomBytes } from 'node:crypto';
import { once } from 'node:events';

Object.defineProperty(Symbol, 'asyncDispose', {
  value: Symbol('asyncDispose'),
});

export const createMqttClient = async (): Promise<
  AsyncDisposable & {
    client: MqttClient;
    waitFor: <K extends keyof MqttClientEventCallbacks>(
      event: K,
      ms?: number,
    ) => Promise<any[]>;
  }
> => {
  const mqttClient = await connectAsync(process.env.MQTT_BROKER_URL, {
    clientId: `test-${randomBytes(4).toString('hex')}`,
    clean: true,
    reconnectPeriod: 0,
  });

  return {
    async [Symbol.asyncDispose]() {
      if (mqttClient.connected) {
        await mqttClient.endAsync(true);
      }
    },
    client: mqttClient,
    waitFor: async (event, ms = 1000) => {
      const abort = new AbortController();
      const timer = setTimeout(() => abort.abort(), ms);
      try {
        return await once(mqttClient, event, {
          signal: abort.signal,
        });
      } finally {
        clearTimeout(timer);
      }
    },
  };
};
