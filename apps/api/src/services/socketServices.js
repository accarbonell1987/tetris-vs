import { Server } from 'socket.io';
import { Lobby } from './lobbyServices';
import { Console } from '../utils/handleConsole';

export const createSocketIo = params => {
  const ioServer = new Server(params.httpServer, {
    pingInterval: 2000,
    pingTimeout: 5000,
    cors: {
      origin: ['http://localhost:5173'],
      credentials: true
      // methods: ['GET', 'POST'],
    }
  });
  return ioServer;
};

export const initializeSocket = ({ io }) => {
  io.on('connection', socket => {
    Console.log('client connected to socket');

    socket.on('disconnect', () => {
      Console.log('client disconnected to socket');
    });
  });
};

// export const socketServer = ({ io }) => {
//   io.on('connection', socket => {
//     console.log('socket is ready for connection');
//     socket.on('joinRoom', ({ ...roomObject }) => {
//       const user = userJoin(
//         socket.id,
//         roomObject.user.name,
//         roomObject.room_uuid,
//         roomObject.user.user_uuid
//       );
//       socket.join(user.room);
//       socket.emit('message', 'Welcome to application' + user.username);
//       socket.broadcast.to(user.room).emit('message', `${user.username} has joined the call`);
//       io.to(user.room).emit('roomUsers', {
//         room: user.room,
//         users: getRoomUsers(user.room)
//       });
//       io.to(user.room).emit('roomSettings', {
//         ...roomObject
//       });
//     });
//   });
// };
