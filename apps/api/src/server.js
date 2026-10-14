import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';

import { version } from '../package.json';
import { Console } from './utils/handleConsole';
import { systemRoutes } from './routes/routesSystem';

import { Lobby } from './services/lobbyServices';
import { Match } from './services/matchServices';
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

// Same policy as the Express cors() above: the dev client runs on another origin (Vite, LAN IPs).
const io = new Server(httpServer, { pingInterval: 2000, pingTimeout: 5000, cors: { origin: true } });

const COUNTDOWN_MS = 3000;

const playerRoom = id => `player:${id}`;
const matchRoom = id => `match:${id}`;
const publicPlayer = ({ id, name, image }) => ({ id, name, image });
const isIdle = id => Lobby.getPlayerById(id)?.status === 'idle';
const broadcastLobby = () => io.emit('lobby-update', Lobby.getPlayersArray());

const isBoard = board =>
  Array.isArray(board) &&
  board.length <= 22 &&
  board.every(
    row => Array.isArray(row) && row.length <= 10 && row.every(cell => Number.isInteger(cell) && cell >= 0 && cell <= 8)
  );

// challenge-error messages are shown as is in the UI, whose copy is Spanish.
const challengeError = (fromId, target) => {
  if (!isIdle(fromId)) return 'Debes estar libre en el lobby para desafiar';
  if (!target) return 'Jugador no encontrado';
  if (target.id === fromId) return 'No puedes desafiarte a ti mismo';
  if (target.status !== 'idle') return 'El jugador está ocupado';
  return null;
};

// The match the sender plays in, when the message targets its current round.
const currentMatch = (socket, message) => {
  const match = Match.get(message?.matchId);
  if (!match || !Match.isMember(match, socket.data.playerId) || message.round !== match.round) return null;
  return match;
};

// Sends to the opponent's sockets in the match room.
const relayToOpponent = (socket, match, event, payload) =>
  io.to(matchRoom(match.id)).except(playerRoom(socket.data.playerId)).emit(event, payload);

const startMatch = (fromId, toId) => {
  const players = [fromId, toId].map(id => publicPlayer(Lobby.getPlayerById(id)));
  const match = Match.create(players);
  players.forEach(player => {
    Match.dropChallenges(player.id);
    Lobby.setStatus(player.id, 'playing');
    io.in(playerRoom(player.id)).socketsJoin(matchRoom(match.id));
  });
  io.to(matchRoom(match.id)).emit('match-start', {
    matchId: match.id,
    players,
    round: match.round,
    seed: match.seed,
    wins: match.wins,
    countdownMs: COUNTDOWN_MS
  });
  broadcastLobby();
};

const endMatch = (match, payload) => {
  io.to(matchRoom(match.id)).emit('match-end', payload);
  io.in(matchRoom(match.id)).socketsLeave(matchRoom(match.id));
  match.players.forEach(player => Lobby.setStatus(player.id, 'idle'));
  broadcastLobby();
};

const forfeitMatch = (match, playerId) => {
  const result = match && Match.forfeit(match.id, playerId);
  if (result) endMatch(match, { ...result, reason: 'forfeit' });
};

io.on('connection', socket => {
  Console.log('a user connected');

  io.emit('lobby-update', Lobby.getPlayersArray());

  socket.on('lobby-join', message => {
    const player = message?.player;
    if (!player?.id) return;
    Console.log(`lobby-join: ${player.name}`);
    socket.data.playerId = player.id;
    socket.join(playerRoom(player.id));
    // A second tab (or a refresh) of a player in a match must not mark them idle.
    const status = Match.findByPlayer(player.id) ? 'playing' : 'idle';
    Lobby.addPlayer({ ...publicPlayer(player), status });
    broadcastLobby();
  });
  socket.on('lobby-leave', message => {
    const player = message?.player;
    if (!player?.id) return;
    Console.log(`lobby-leave: ${player.name}`);
    Lobby.removePlayer(player);
    io.emit('lobby-update', Lobby.getPlayersArray());
  });

  socket.on('challenge-send', message => {
    const fromId = socket.data.playerId;
    const target = Lobby.getPlayerById(message?.to);
    const error = challengeError(fromId, target);
    if (error) return socket.emit('challenge-error', { message: error });
    Match.sendChallenge(fromId, target.id).forEach(replacedId =>
      io.to(playerRoom(replacedId)).emit('challenge-error', { message: `${target.name} recibió otro desafío` })
    );
    io.to(playerRoom(target.id)).emit('challenge-received', { from: publicPlayer(Lobby.getPlayerById(fromId)) });
  });

  socket.on('challenge-accept', message => {
    const fromId = message?.from;
    const toId = socket.data.playerId;
    if (!isIdle(fromId) || !isIdle(toId) || !Match.takeChallenge(fromId, toId)) {
      return socket.emit('challenge-error', { message: 'El desafío ya no está disponible' });
    }
    startMatch(fromId, toId);
  });

  socket.on('challenge-decline', message => {
    const fromId = message?.from;
    const byId = socket.data.playerId;
    if (!Match.takeChallenge(fromId, byId)) return;
    io.to(playerRoom(fromId)).emit('challenge-declined', { by: { id: byId, name: Lobby.getPlayerById(byId)?.name } });
  });

  socket.on('match-garbage', message => {
    const match = currentMatch(socket, message);
    const lines = message?.lines;
    if (!match || !Number.isInteger(lines) || lines < 1 || lines > 20) return;
    relayToOpponent(socket, match, 'match-garbage', { round: match.round, lines });
  });

  socket.on('match-board', message => {
    const match = currentMatch(socket, message);
    if (!match || !isBoard(message.board)) return;
    relayToOpponent(socket, match, 'match-board', { round: match.round, board: message.board });
  });

  socket.on('match-topout', message => {
    const match = Match.get(message?.matchId);
    const result = match && Match.topOut(match.id, socket.data.playerId, message.round);
    if (!result) return;
    const { round, winner, wins, matchOver } = result;
    io.to(matchRoom(match.id)).emit('round-end', { round, winner, wins });
    if (matchOver) return endMatch(match, { winner, wins, reason: 'ko' });
    io.to(matchRoom(match.id)).emit('round-start', {
      round: match.round,
      seed: match.seed,
      wins,
      countdownMs: COUNTDOWN_MS
    });
  });

  socket.on('match-leave', message => {
    forfeitMatch(Match.get(message?.matchId), socket.data.playerId);
  });

  socket.on('disconnect', () => {
    Console.log('user disconnected');
    const playerId = socket.data.playerId;
    if (playerId === undefined) return;
    forfeitMatch(Match.findByPlayer(playerId), playerId);
    Match.dropChallenges(playerId);
    // ponytail: a refresh can reconnect before the old socket drops; keep the player listed while any socket remains
    if (io.sockets.adapter.rooms.has(playerRoom(playerId))) return;
    Lobby.removePlayer({ id: playerId });
    broadcastLobby();
  });
});

app.use(express.static('dist'));

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, SERVER, () => {
    Console.log(`API v${version}, Server Started at: ws://${SERVER}:${PORT} ☕`);
  });
}

export { app, httpServer, io };
