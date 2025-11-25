import { io } from 'socket.io-client';

const urlSocketServer = import.meta.env.VITE_API_SERVER;

export const SocketService = {
  socket: null,
  createSocketService: () => {
    const socket = io(urlSocketServer || 'http://localhost:3000');
    SocketService.socket = socket;
  },
  reconnect: () => {
    try {
      SocketService.socket.on('reconnect', () => {
        console.log('Socket reconnected');
        SocketService.socket.connect();
      });
    } catch (error) {
      console.log(error);
    }
  },
  disconnect: () => {
    try {
      console.log('Socket disconnected');
      SocketService.socket.disconnect();
    } catch (error) {
      console.log(error);
    }
  },

  login: player => {
    try {
      SocketService.socket.emit('login', player);
    } catch (error) {
      console.log(error);
    }
  }
};
