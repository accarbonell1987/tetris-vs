import { describe, test, expect, vi, beforeEach } from 'vitest';
import { SocketService } from '../../src/services/socketService.js';
import { io } from 'socket.io-client';
import useGlobalStore from '../../src/store/useGlobalStore';

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    emit: vi.fn(),
    on: vi.fn(),
    disconnect: vi.fn(),
    connect: vi.fn(),
  }))
}));

// Mock global store
vi.mock('../../src/store/useGlobalStore', () => ({
  default: {
    getState: vi.fn(),
  },
}));

describe('SocketService login method', () => {
  let mockSocket;
  let mockStore;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSocket = {
      emit: vi.fn(),
      on: vi.fn(),
      disconnect: vi.fn(),
      connect: vi.fn(),
    };
    mockStore = {
      socket: null,
      setSocket: vi.fn(),
      setError: vi.fn(),
    };
    useGlobalStore.getState.mockReturnValue(mockStore);
    io.mockReturnValue(mockSocket);
  });

  test('emits lobby-join event with player payload', () => {
    // Setup store with a socket
    mockStore.socket = mockSocket;
    SocketService.login({ id: 'player-123', name: 'Alice' });
    expect(mockSocket.emit).toHaveBeenCalledTimes(1);
    expect(mockSocket.emit).toHaveBeenCalledWith('lobby-join', {
      player: { id: 'player-123', name: 'Alice' }
    });
  });

  test('handles missing socket by setting error', () => {
    mockStore.socket = null;
    SocketService.login({ id: 'player-123', name: 'Alice' });
    expect(mockStore.setError).toHaveBeenCalledWith(expect.objectContaining({
      message: 'No socket available for login',
      details: 'Socket instance is null',
    }));
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});