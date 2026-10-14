import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { io as ioClient } from 'socket.io-client';
import { app, httpServer, io } from '../../src/server.js';
import { Lobby } from '../../src/services/lobbyServices.js';

describe('Lobby join/leave flow', () => {
  let serverPort;
  let clientSocket;

  beforeAll(async () => {
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
    expect(players[0]).toEqual({ ...player, status: 'idle' });
  });

  test('player leaves lobby and lobby-update reflects removal', async () => {
    clientSocket = ioClient(`http://localhost:${serverPort}`);
    await new Promise((resolve) => clientSocket.on('connect', resolve));

    // First join a player; the connection itself also broadcasts, so wait for the update listing them
    const player = { id: 'player-456', name: 'Bob' };
    const joined = new Promise((resolve) => {
      const handler = (players) => {
        if (!players.some((entry) => entry.id === player.id)) return;
        clientSocket.off('lobby-update', handler);
        resolve();
      };
      clientSocket.on('lobby-update', handler);
    });
    clientSocket.emit('lobby-join', { player });
    await joined;

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

  test('lobby-leave without a player is ignored and the server keeps serving', async () => {
    clientSocket = ioClient(`http://localhost:${serverPort}`);
    await new Promise((resolve) => clientSocket.on('connect', resolve));
    clientSocket.emit('lobby-leave');
    clientSocket.emit('lobby-leave', null);
    clientSocket.emit('lobby-leave', {});
    const player = { id: 'player-after-leave', name: 'Dana' };
    const update = new Promise((resolve) => {
      clientSocket.on('lobby-update', (players) => {
        if (players.some((entry) => entry.id === player.id)) resolve(players);
      });
    });
    clientSocket.emit('lobby-join', { player });
    expect(await update).toEqual([{ ...player, status: 'idle' }]);
  });

  test('multiple players join and lobby-update contains all', async () => {
    const socket1 = ioClient(`http://localhost:${serverPort}`);
    const socket2 = ioClient(`http://localhost:${serverPort}`);
    await Promise.all([
      new Promise(resolve => socket1.on('connect', resolve)),
      new Promise(resolve => socket2.on('connect', resolve))
    ]);

    const player1 = { id: 'p1', name: 'Alice' };
    const player2 = { id: 'p2', name: 'Bob' };

    // Listen for updates on socket1 (any socket will receive broadcast)
    const updates = [];
    socket1.on('lobby-update', (data) => {
      updates.push(data);
    });

    socket1.emit('lobby-join', { player: player1 });
    // Wait a bit for first update
    await new Promise(resolve => setTimeout(resolve, 100));
    socket2.emit('lobby-join', { player: player2 });
    await new Promise(resolve => setTimeout(resolve, 100));

    // Expect at least one update containing both players
    // The last update should have both players
    const lastUpdate = updates[updates.length - 1];
    expect(lastUpdate).toHaveLength(2);
    expect(lastUpdate).toEqual(
      expect.arrayContaining([
        { ...player1, status: 'idle' },
        { ...player2, status: 'idle' }
      ])
    );

    socket1.disconnect();
    socket2.disconnect();
  });

  test('disconnecting removes the player from the lobby', async () => {
    const leaving = ioClient(`http://localhost:${serverPort}`, { forceNew: true });
    clientSocket = ioClient(`http://localhost:${serverPort}`, { forceNew: true });
    await Promise.all([
      new Promise(resolve => leaving.on('connect', resolve)),
      new Promise(resolve => clientSocket.on('connect', resolve))
    ]);
    const player = { id: 'p-gone', name: 'Gone' };
    const joined = new Promise(resolve => {
      const handler = players => {
        if (!players.some(entry => entry.id === player.id)) return;
        clientSocket.off('lobby-update', handler);
        resolve();
      };
      clientSocket.on('lobby-update', handler);
    });
    leaving.emit('lobby-join', { player });
    await joined;

    const removed = new Promise(resolve => {
      clientSocket.on('lobby-update', players => {
        if (!players.some(entry => entry.id === player.id)) resolve(players);
      });
    });
    leaving.disconnect();
    expect(await removed).toEqual([]);
  });
});
