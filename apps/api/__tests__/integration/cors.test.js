import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { httpServer } from '../../src/server.js';

describe('Socket.IO CORS', () => {
  let serverPort;

  beforeAll(async () => {
    await new Promise(resolve => httpServer.listen(0, 'localhost', resolve));
    serverPort = httpServer.address().port;
  });

  afterAll(() => {
    httpServer.close();
  });

  test('allows a browser on another origin to open the polling handshake', async () => {
    const origin = 'http://localhost:5173';
    const response = await fetch(`http://localhost:${serverPort}/socket.io/?EIO=4&transport=polling`, {
      headers: { Origin: origin }
    });
    expect(response.status).toBe(200);
    expect(response.headers.get('access-control-allow-origin')).toBe(origin);
  });
});
