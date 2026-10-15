# tetris-vs

A Tetris versus game with two modes:

- **Online 1v1**: each player has their own board. Line clears send garbage to the opponent. KO best of 3: you lose a round when you top out, and the first player to win 2 rounds wins the match. Challenge another player from the lobby with the "VS" button.
- **Local**: two players share one board and one keyboard. Each line goes to the player who closed it (100 / 300 / 500 / 800 points for 1-4 lines). First to 3000 wins; if a player's piece cannot spawn, that player loses. Open it with "Partida local" in the lobby.

## Rules

Modern Tetris rules from the shared engine:

- **Board and pieces:** 10x20 board, 7-bag randomizer, 5-piece preview.
- **Movement:** SRS rotation with wall kicks in both directions, hold once per piece, ghost piece, hard drop.
- **Timing:** 500 ms lock delay with up to 15 resets, Guideline gravity curve.
- **Attack (online):**
  - Lines send 0 / 1 / 2 / 4. A T-spin double sends 4.
  - Combos add a bonus (Tetris 99 table) and back-to-back adds +1.
  - Your attack cancels your pending garbage first.
  - Incoming garbage rises 500 ms later, on your next lock that clears nothing.

## Controls

| Action                   | Local P1   | Local P2    | Online         |
| ------------------------ | ---------- | ----------- | -------------- |
| Move                     | A / D      | ← / →       | A / D or ← / → |
| Soft drop                | S          | ↓           | S or ↓         |
| Rotate clockwise         | W          | ↑           | W or ↑         |
| Rotate counter-clockwise | Q          | /           | Q or /         |
| Hard drop                | Space      | Enter       | Space or Enter |
| Hold                     | Left Shift | Right Shift | Shift          |
| Pause                    | Esc or P   | Esc or P    | —              |

**Gamepads** (browser Gamepad API, standard mapping: PS4 DualShock and Xbox-style pads): D-pad or left stick to move and soft drop, D-pad ↑ hard drop, Cross/A rotate clockwise, Circle/B counter-clockwise, Square/Triangle/L1/R1 hold, Options/Start pause (local). In the local mode the first connected pad is P1 and the second P2; online, any pad drives your board. A pad must be recognized by the operating system first; most browsers only expose it after a button is pressed on the page.

Left/right repeat with DAS 170 ms and ARR 50 ms. On touch devices the local mode shows on-screen buttons for P1.

## Project structure

npm workspaces:

| Path                 | What                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `packages/shared`    | `@tetris/shared`: pure, deterministic engine (no canvas, no timers). See [its readme](packages/shared/readme.md). |
| `apps/web`           | React 18 + Vite + NextUI client: login, lobby, local and online views, canvas renderer, input layer.              |
| `apps/api`           | Express + Socket.IO server: lobby, challenges, match referee and relays.                                          |
| `docs/event-flow.md` | The [Socket.IO protocol](docs/event-flow.md) between web and api.                                                 |
| `odd/tasks/`         | Specs, decisions and evidence for each feature.                                                                   |

## Development

Requires Node 24.

```bash
npm ci
```

```bash
npm run server
```

```bash
npm run web
```

- **API:** runs on `http://localhost:3000` (`PORT` and `SERVER` env vars).
- **Web:** runs on `http://localhost:5173`. It connects to `VITE_API_SERVER`, default `http://localhost:3000`.
- **`npm ci`:** installs the exact versions from `package-lock.json` and links `@tetris/shared` into `node_modules`; run it again after pulling dependency changes. Use `npm install <package>` only to add or upgrade a dependency, and commit the updated lockfile.

## Docker

One container runs everything: the API serves the built web app on the same origin, so there is no CORS to configure.

```bash
docker compose up --build
```

- Open `http://localhost:3000`. For a two-player test on one machine, use `http://localhost:3000` and `http://127.0.0.1:3000`; they are different origins, so each keeps its own session.
- Stop the dev servers first: the container uses port 3000.
- Environment: `PORT` (default 3000) and `RECONNECT_GRACE_MS` (default 15000, also set in `docker-compose.yml`).
- `/health` and `/version` answer JSON; any other path without a file extension loads the app, so reloading `/match` works.

## Tests and lint

```bash
npm test
```

```bash
npm run lint
```

`npm test` runs all three suites: the engine (`node --test`), the api (Vitest, including multi-client Socket.IO integration tests) and the web (Vitest). CI (`.github/workflows/ci.yml`) installs with `npm ci` and runs lint and tests on every push and pull request to `main` and `front-web`.

## Status

What is planned next is in [TODO.md](TODO.md).
