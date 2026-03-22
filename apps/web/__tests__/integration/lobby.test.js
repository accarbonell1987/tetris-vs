// @vitest-environment node
import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { io as ioClient } from 'socket.io-client';

// Mock the server module to avoid polyfill issues with http.createServer
vi.mock('../../../api/src/server.js', () => ({
  app: {},
  httpServer: {
    listen: vi.fn((port, host, cb) => cb()),
    address: () => ({ port: 12345 }),
    close: vi.fn(),
  },
  io: {
    on: vi.fn(),
  },
}));

import { app, httpServer, io } from '../../../api/src/server.js';
import { Lobby } from '../../../api/src/services/lobbyServices.js';

describe.skip('Lobby join/leave flow', () => {
  let serverPort;
  let clientSocket;

  beforeAll(async () => {
    // Ensure server does not auto-listen (NODE_ENV=test already set by vitest)
    // Start the server on a random port (port 0)
    await new Promise((resolve) => {
      httpServer.listen(0, 'localhost', resolve);
    });
    serverPort = httpServer.address().port;
    console.log(`Test server listening on port ${serverPort}`);
  });

  afterAll(() => {
    httpServer.close();
  });

  beforeEach(() => {
    // Clear lobby state between tests
    Lobby.clearConnectedPlayers();
  });

  afterEach(() => {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  test('player joins lobby and lobby-update is broadcast', async () => {
    clientSocket = ioClient(`http://localhost:${serverPort}`);
    
    // Wait for connection
    await new Promise((resolve) => clientSocket.on('connect', resolve));

    // Listen for lobby-update event
    const updatePromise = new Promise((resolve) => {
      clientSocket.on('lobby-update', (data) => {
        resolve(data);
      });
    });

    // Emit lobby-join with player
    const player = { id: 'player-123', name: 'Alice' };
    clientSocket.emit('lobby-join', { player });

    // Wait for lobby-update
    const players = await updatePromise;
    
    // Expect players array to contain the joined player
    expect(players).toHaveLength(1);
    expect(players[0]).toEqual(player);
  });

  test('player leaves lobby and lobby-update reflects removal', async () => {
    clientSocket = ioClient(`http://localhost:${serverPort}`);
    await new Promise((resolve) => clientSocket.on('connect', resolve));

    // First join a player
    const player = { id: 'player-456', name: 'Bob' };
    clientSocket.emit('lobby-join', { player });

    // Wait for first update (optional)
    const firstUpdate = new Promise((resolve) => {
      clientSocket.once('lobby-update', resolve);
    });
    await firstUpdate;

    // Now leave
    const updatePromise = new Promise((resolve) => {
      clientSocket.on('lobby-update', (data) => {
        resolve(data);
      });
    });
    clientSocket.emit('lobby-leave', { player });

    const players = await updatePromise;
    // Expect empty array after leave
    expect(players).toHaveLength(0);
  });
});