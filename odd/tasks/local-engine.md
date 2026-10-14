# local-engine

Objective: run the local shared-board mode on `@tetris/shared` with a proper input layer, and fix the bugs found in the audit.
Branch: `feat/local-engine` (stacked on `feat/pure-engine`, PR #6). Delivery: single-pr (user: "no dividas nada"). Test runners: vitest (`apps/web`, `apps/api`), `node --test` (`packages/shared`).

## Specs

- S1 Local mode uses the engine: `createGame({ players: 2, targetScore: 3000 })`, 10x20 board, scores "x / 3000" for both players, winner shown when someone reaches 3000 or the other tops out; rematch button.
- S2 Input layer: "DAS de 170 ms y ARR de 50 ms" for left/right; soft drop repeats every 50 ms; rotate, hard drop and hold fire once per press. Two players on one keyboard.
- S3 Rendering: colors per piece, ghost per player, "5 piezas en la cola de siguientes" and hold per player; pause overlay.
- S4 Bugs from the audit: "el estado del rival que muestra el tuyo", Socket.IO without CORS, socket not recreated after a refresh, Login `Error` component misuse, "limpiar el loop" (rAF and keydown never cleaned up), `new Image()` every frame.
- S5 The local mode is reachable from the lobby (today nothing navigates to `/game`).

Assumptions (marked):
- A1 Controls. P1: A/D move, S soft drop, W rotate CW, Q rotate CCW, Space hard drop, Left Shift hold. P2: arrows move/soft drop, Up rotate CW, Slash rotate CCW, Enter hard drop, Right Shift hold. Pause moves from Space to Escape/P. A controls legend is shown under the board.
- A2 Socket.IO CORS mirrors the existing Express `cors()` policy (any origin), because `vite --host` serves on LAN IPs too.
- A3 Touch buttons stay P1-only; the booster button becomes hard drop (boosters were rejected).
- A4 Player names stay the router's hardcoded ones; wiring real players is step 3.
- A5 The old engine files in `apps/web/src/views/Game` (classes, func, canvas, tetris.js) are replaced and deleted.

## Tasks

- [x] T1 S2 — input layer (DAS/ARR) with unit tests — inline — 780badb (7/7 GREEN after observed RED: module missing)
- [x] T2 S1 S3 S4(rival state, loop cleanup, Image per frame) S5 — game view on the engine, renderer, overlays, lobby button — inline — b7b46c7 (lint clean, web suite 28 passed / 2 pre-existing skips; browser: move, rotate CCW, soft/hard drop, hold, ghosts, queues, pause, top-out winner, rematch observed; HUD score update after a clear not observed directly)
- [x] T3 S4(CORS, socket after refresh, Login Error) — api and session fixes — inline — bce9e6a (CORS RED: header null → GREEN; LocalStorageProvider RED: Maximum update depth → GREEN; avatars RED: undefined → GREEN; suites: shared 33, web 29 + 2 pre-existing skips, api 14; lint: 7 pre-existing warnings, none new; browser: login, refresh restores lobby over socket, Partida local opens /game)

Route: all inline (units share the web app; no Writer trigger).

## Log

- L1 (2026-10-14) User: "Sube el PR, no dividas nada y pasa al paso 2"
- L2 Step 2 as proposed earlier: "Pasar el modo local a ese motor y arreglar los bugs (CORS, el estado del rival que muestra el tuyo, limpiar el loop)."
- L3 (2026-10-14) Browser check found that a focused NextUI button swallows Space/Enter (P1/P2 hard drop): game keys are now captured on window in the capture phase and stop propagation.
- L4 (2026-10-14) Browser verification found two more blockers, fixed in T3 with tests: (1) avatar fetch threw on network errors (response undefined) so login never rendered; the old test pinned that behavior and was replaced; (2) LocalStorageProvider re-ran its effect every render and crashed the app after login (Maximum update depth). Also: createSocketService reuses an existing socket (StrictMode double effects). Not fixed: PrivateRoute rememberMe redirect loop (rememberMe is never set).
