import axios from 'axios';
import { once } from 'node:events';
import { createMqttClient } from './helpers';

const ROUTING_KEY_PREFIX = 'mqtt-demo-1';
const HTTP_METHOD_PREFIX = 'http-demo-1';

describe(`GET /${HTTP_METHOD_PREFIX}`, () => {
  it('should return a message', async () => {
    const res = await axios.get(`/${HTTP_METHOD_PREFIX}/id`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Well done chaps!' });
  });
});

describe(`emit to ${ROUTING_KEY_PREFIX}/test`, () => {
  it('should emit an event', async () => {
    await using mqttClientManager = await createMqttClient();
    await mqttClientManager.client.subscribeAsync('reply');
    await mqttClientManager.client.publishAsync(
      `${ROUTING_KEY_PREFIX}/test`,
      JSON.stringify({ message: 'Hello, World!' }),
    );

    const [, payload] = await once(mqttClientManager.client, 'message');
    expect(JSON.parse(payload.toString())).toEqual({
      message: 'Well done chaps!',
    });
  });
});
