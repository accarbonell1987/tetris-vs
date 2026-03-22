import { io } from 'socket.io-client';
import useGlobalStore from '../store/useGlobalStore';

const urlSocketServer = import.meta.env.VITE_API_SERVER;

export const SocketService = {
  createSocketService: () => {
    try {
      const socket = io(urlSocketServer || 'http://localhost:3000');
      useGlobalStore.getState().setSocket(socket);
      return socket;
    } catch (error) {
      console.error('Failed to create socket:', error);
      useGlobalStore.getState().setError({
        message: 'Failed to create socket connection',
        details: error.message,
        timestamp: Date.now()
      });
      throw error;
    }
  },
  reconnect: () => {
    try {
      const socket = useGlobalStore.getState().socket;
      if (!socket) {
        console.warn('No socket to reconnect');
        return;
      }
      socket.on('reconnect', () => {
        console.log('Socket reconnected');
        socket.connect();
      });
    } catch (error) {
      console.error('Socket reconnect error:', error);
      useGlobalStore.getState().setError({
        message: 'Socket reconnect error',
        details: error.message,
        timestamp: Date.now()
      });
    }
  },
  disconnect: () => {
    try {
      const socket = useGlobalStore.getState().socket;
      if (!socket) {
        console.warn('No socket to disconnect');
        return;
      }
      console.log('Socket disconnected');
      socket.disconnect();
      useGlobalStore.getState().setSocket(null);
    } catch (error) {
      console.error('Socket disconnect error:', error);
      useGlobalStore.getState().setError({
        message: 'Socket disconnect error',
        details: error.message,
        timestamp: Date.now()
      });
    }
  },

  login: player => {
    try {
      const socket = useGlobalStore.getState().socket;
      if (!socket) {
        console.error('No socket available for login');
        useGlobalStore.getState().setError({
          message: 'No socket available for login',
          details: 'Socket instance is null',
          timestamp: Date.now()
        });
        return;
      }
      socket.emit('lobby-join', { player });
    } catch (error) {
      console.error('Socket login error:', error);
      useGlobalStore.getState().setError({
        message: 'Socket login error',
        details: error.message,
        timestamp: Date.now()
      });
      throw error;
    }
  }
};
