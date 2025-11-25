import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';

import { version } from '../package.json';
import { Console } from './utils/handleConsole';
import { systemRoutes } from './routes/routesSystem';
import { createSocketIo, initializeSocket } from './services/socketServices';
import { Lobby } from './services/lobbyServices';
import { Server } from 'socket.io';

//? cargando las variables de entorno
dotenv.config();

//? cargando puertos de configuracion
const PORT = process.env.PORT || 3000;
const SERVER = process.env.SERVER || 'localhost';

const app = express();

//? configurando express
app.set('port', PORT);
app.set('json spaces', 2);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(systemRoutes);

//? socket
const httpServer = http.createServer(app);

//? injection of http server
// const io = createSocketIo({ httpServer });
// initializeSocket({ io });

const io = new Server(httpServer, { pingInterval: 2000, pingTimeout: 5000 });

io.on('connection', socket => {
  Console.log('a user connected');

  io.emit('lobby-update', Lobby.getConnectedPlayers());

  socket.on('lobby-join', ({ player }) => {
    Console.log(`lobby-join: ${player.name}`);
    Lobby.addPlayer(player);
  });
  socket.on('lobby-leave', ({ player }) => {
    Console.log(`lobby-leave: ${player.name}`);
    Lobby.removePlayer(player);
  });

  socket.on('disconnect', () => {
    Console.log('user disconnected');
  });
});

app.use(express.static('dist'));

httpServer.listen(PORT, SERVER, () => {
  Console.log(`API v${version}, Server Started at: ws://${SERVER}:${PORT} ☕`);
});
