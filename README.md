# tetris-vs

Real‑time multiplayer Tetris game with lobby, matchmaking, and WebSocket synchronization.

## Project Status

The project is under active development. The core lobby functionality has been fixed and now supports real‑time player updates. Critical bugs (Map syntax, socket event mismatches, hardcoded UI data, duplicate state) have been resolved.

### Key Features
- Lobby with live player list
- WebSocket‑based real‑time communication
- Persistent session (24‑hour expiry)
- Random avatar service with retry logic
- React front‑end with Zustand state management
- Express + Socket.IO back‑end

## Development

### Workspaces
This is a monorepo using npm workspaces:
- `apps/web` – React/Vite front‑end
- `apps/api` – Express/Socket.IO back‑end
- `packages/` – shared configuration

### Running the Application
```bash
# Install dependencies (root)
npm install

# Start front‑end (dev server)
npm run web

# Start back‑end (dev server)
npm run server
```
The front‑end will be available at `http://localhost:5173`, the back‑end at `http://localhost:5000`.

## Running Tests

A Vitest test suite has been added for critical integration and unit tests.

### Front‑end Tests
```bash
cd apps/web
npm test          # run test suite once
npm run test:ui   # open Vitest UI
```

### Back‑end Tests
```bash
cd apps/api
npm test          # run test suite once
```

### Available Test Files
- `apps/web/__tests__/integration/lobby.test.js` – lobby join/leave flow
- `apps/web/__tests__/integration/socket.test.js` – socket event alignment
- `apps/web/__tests__/unit/servicesAvatars.test.js` – avatar service retry logic
- `apps/web/__tests__/integration/auth.test.js` – login navigation & session persistence
- `apps/api/__tests__/unit/lobbyServices.test.js` – lobby service Map operations

### Linting & Formatting
```bash
# Web workspace
cd apps/web
npm run lint              # check ESLint
# (add --fix to auto‑fix)

# API workspace
cd apps/api
npm run lint              # check ESLint
npm run lint:fix          # auto‑fix ESLint issues
npm run format:write      # format with Prettier
```

## WebSocket Event Flow

Detailed event sequences and payloads are documented in [`docs/event-flow.md`](docs/event-flow.md). In short:

1. **Lobby join**: Front‑end emits `'lobby‑join'` → server adds player → broadcasts `'lobby‑update'` to all clients.
2. **Lobby leave**: Front‑end emits `'lobby‑leave'` → server removes player → broadcasts updated list.
3. **Real‑time UI**: Lobby UI subscribes to the global store and re‑renders when `'lobby‑update'` arrives.

## Recent Bug Fixes & Improvements

The following critical bugs were fixed as part of a recent code‑review refactoring:

- **Map syntax** – lobby service now stores players correctly (`Map(id, player)`).
- **Missing login handler** – server listens for `'lobby‑join'` (not `'login'`).
- **Duplicate socket state** – only one socket instance, stored in the global store.
- **Hardcoded UI data** – lobby UI displays real‑time player data from WebSocket.
- **Avatar retry logic** – retry loop respects limit (10) and returns a dense array.
- **Login navigation** – condition now checks session validity correctly.
- **Expiration constant** – moved to config file for easy adjustment.

See `docs/event-flow.md` for more details.

## Next Steps

- Implement game canvas and Tetris mechanics.
- Add matchmaking and game‑room logic.
- Enhance UI/UX with animations and responsive design.
- Deploy to a public server.

---

*Legenda* (original checklist legend):
- (D) – Done o Terminado
- (W) – Working o en Progreso
- (P) – Pending o Pendiente

*Checklist* (original development tasks):
- Web
  > crear aplicación (D)
  > instalación de librerias y componentes (W)
  > creación del layout (P)
  > creación de pantalla de login (P)
  > creación de pantalla de lobby (P)
  > creación de pantalla de juego (P)
  > desarrollar flujo de login (P)
  > desarrollar flujo de lobby (P)
  > desarrollar flujo de juego (P)
  > desarrollar canvas de juego (P)
  > desarrollar comunicación de juego (P)
