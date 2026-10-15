# match-reconnect

Objective: a network drop or a page reload must not lose an online match; fix the three small online leftovers on the way.
Branch: `feat/match-reconnect` (from `front-web`). Delivery: single-pr. Test runners: vitest (`apps/api`, `apps/web`), `node --test` (`packages/shared`). Root `npm test` / `npm run lint` must stay green (CI).

## Specs

- S1 Reconnection: "Hoy un corte de red de unos 7 segundos te hace perder la partida por abandono." The server waits a grace period before forfeiting a disconnected player.
- S2 Network drop (the page is still alive with its board): the round is paused for both players and resumes where it was after a 3 s countdown.
- S3 Page reload (the board is lost): "al volver lo razonable es que esa ronda cuente como perdida y siga la siguiente." The match goes on; reloading is never a way to restart a board.
- S4 "Salir de `/match` sin 'Abandonar' deja la partida guardada en el store del cliente."
- S5 "Cualquier socket desconectado hace perder la partida."
- S6 "Si un jugador te desafía y después desafía a otro, tu invitación sigue abierta y al aceptarla responde 'El desafío ya no está disponible'."

Assumptions (marked):
- A1 Grace period 15 s (`RECONNECT_GRACE_MS`, overridable by env var for tests). Timeout → `match-end { reason: 'disconnect' }` to the opponent.
- A2 A player is "connected to the match" while at least one of their sockets is in the room `match:<id>`. The grace starts only when the last one leaves; closing one of two tabs does nothing (S5).
- A3 During an active match the client stays on `/match`: any other route redirects there (S4). The store match is replaced by what the server says (`match-active`, `match-end`), never kept stale.
- A4 A pending challenge dropped for any reason other than accept/decline (replaced by a new one from the same challenger, the challenger starts a match, disconnects) tells its target with `challenge-cancelled`, and the target's invite modal closes (S6).
- A5 Clients are still trusted (A1 of online-match): a client that says it lost its board loses the round.

## Protocol changes (extends docs/event-flow.md)

- S→C `opponent-disconnected { graceMs }` to the opponent when the grace starts. The opponent's client pauses its game and shows "Esperando a <name>… <seconds>".
- Client side, on its own socket `disconnect` while in `/match`: pause the game, show "Reconectando…".
- C→S `match-rejoin { matchId, round, hasGame }` sent by a client in `/match` after (re)connecting. The socket joins `match:<id>`; a pending grace timer is cleared. Ignored when the match does not exist or the player is not in it.
  - `hasGame: true` (network drop, same round): S→C `match-resume { round, wins, countdownMs: 3000 }` to both; both resume after the countdown.
  - `hasGame: false` (reload) or a round mismatch: that player loses the current round exactly like `match-topout` (`round-end` + `round-start`, or `match-end` on the second loss).
- S→C `match-active { matchId, players, round, seed, wins, countdownMs }` to a socket whose `lobby-join` belongs to a player with an active match (reload, new tab). The client stores it and goes to `/match`, which then sends `match-rejoin { hasGame: false }`.
- S→C `challenge-cancelled { from }` to the target of a dropped pending challenge (A4).
- `match-end.reason` can now be `ko`, `forfeit` or `disconnect`.

## Tasks

- [ ] T1 S1-S6 — API and web implementation with tests — delegated (writer; context backstop of the parent session)
- [ ] T2 all — browser checks: network drop (socket disconnect/connect), reload mid-round, grace timeout, closing one of two tabs, stale invite — inline
- [ ] T3 docs — update `docs/event-flow.md`, `TODO.md` — inline

## Log

- L1 (2026-10-14) User: "dale, arrancá con la reconexión" (answer to: "¿Arranco con la reconexión e incluyo esos tres pendientes chicos?")
