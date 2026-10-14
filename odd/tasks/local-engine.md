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

- [ ] T1 S2 — input layer (DAS/ARR) with unit tests — inline
- [ ] T2 S1 S3 S4(rival state, loop cleanup, Image per frame) S5 — game view on the engine, renderer, overlays, lobby button — inline
- [ ] T3 S4(CORS, socket after refresh, Login Error) — api and session fixes — inline

Route: all inline (units share the web app; no Writer trigger).

## Log

- L1 (2026-10-14) User: "Sube el PR, no dividas nada y pasa al paso 2"
- L2 Step 2 as proposed earlier: "Pasar el modo local a ese motor y arreglar los bugs (CORS, el estado del rival que muestra el tuyo, limpiar el loop)."
