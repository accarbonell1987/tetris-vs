# api

Express + Socket.IO server for tetris-vs: lobby, challenges, match referee and garbage/board relays. The protocol is in [`docs/event-flow.md`](../../docs/event-flow.md).

- `src/server.js`: Express app and every Socket.IO handler.
- `src/services/lobbyServices.js`: connected players and their `idle` / `playing` status.
- `src/services/matchServices.js`: matches, rounds and best-of-3 wins, forfeits, pending challenges. These are plain functions, unit-tested without sockets.

```bash
npm run dev
```

```bash
npm test -- --run
```

```bash
npm run lint
```

The dev server listens on `http://localhost:3000` (`PORT` and `SERVER` env vars). Integration tests start the server on a random port and talk to it with real `socket.io-client` clients.
