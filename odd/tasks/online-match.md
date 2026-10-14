# online-match

Objective: online 1v1 versus: challenge from the lobby "VS" button, rooms, separate boards with garbage over the network, KO best of 3.
Branch: `feat/online-match` (stacked on `feat/local-engine`, PR #7). Delivery: single-pr. Test runners: vitest (`apps/api`, `apps/web`), `node --test` (`packages/shared`).

## Specs

- S1 Challenge: "desafío desde el lobby" via the existing "VS" button. The target sees the invite and can accept or decline; the challenger is told about a decline or an invalid challenge.
- S2 Online play uses "tableros separados con ataques": each client simulates its own board with `@tetris/shared` (`createGame({ seed })`, one player); both players get the same seed per round, so the same piece sequence.
- S3 Garbage over the network: the `sent` of each `clear` event goes to the opponent, who applies it with `receiveGarbage` (engine already handles cancel, 500 ms delay, rise on non-clearing lock).
- S4 Win: "KO al mejor de 3": "Pierde la ronda el que se llena (top-out) y gana el primero que se lleva 2 rondas." "Entre rondas: 3 s de cuenta regresiva."
- S5 Each player sees the opponent's board live (snapshots) and their own pending garbage.
- S6 Robustness: disconnecting or leaving mid-match loses the match by forfeit; disconnecting removes the player from the lobby (audit bug: disconnect never removed players).

Assumptions (marked):
- A1 Server is a relay plus match referee (rounds, wins); it does not run the engine. Clients are trusted (no anti-cheat).
- A2 Players carry `status: 'idle' | 'playing'` in the lobby list; you cannot challenge yourself, a playing player, or while playing.
- A3 One pending challenge per challenger; it is dropped when either side disconnects or a match starts. No expiry timer.
- A4 Online keyboard: one player per keyboard, so both the P1 keys (WASD, Q, Space, Left Shift) and the P2 keys (arrows, Slash, Enter, Right Shift) drive the same board.
- A5 Board snapshots are sent at most every 100 ms and include the falling piece drawn into the board.

## Protocol (Socket.IO events; the contract both sides implement)

Lobby:
- C→S `lobby-join { player: { id, name, image } }` (exists). Server remembers `socket.data.playerId` and sets `status: 'idle'`.
- S→C `lobby-update [{ id, name, image, status }]` (exists, now with `status`).
- `disconnect`: remove the player from the lobby and broadcast `lobby-update`; drop their pending challenges; forfeit their match if any.

Challenge:
- C→S `challenge-send { to }` (player id). Invalid (unknown target, self, target or challenger not idle) → S→C `challenge-error { message }` to the challenger. Valid → S→C `challenge-received { from: { id, name, image } }` to the target.
- C→S `challenge-accept { from }` → if the pending challenge exists and both are idle: start the match. Otherwise `challenge-error` to the acceptor.
- C→S `challenge-decline { from }` → S→C `challenge-declined { by: { id, name } }` to the challenger.

Match (server room `match:<matchId>`):
- S→C `match-start { matchId, players: [{ id, name, image }, { id, name, image }], round: 1, seed, wins: { [id]: 0 }, countdownMs: 3000 }` to both. Both become `playing`; broadcast `lobby-update`.
- C→S `match-garbage { matchId, round, lines }` → relayed as S→C `match-garbage { round, lines }` to the opponent. Ignored unless the match is active, `round` is current, and `lines` is an integer 1..20.
- C→S `match-board { matchId, round, board }` → relayed as S→C `match-board { round, board }` to the opponent. Ignored unless active and current round; `board` must be an array of at most 22 rows of at most 10 integers 0..8.
- C→S `match-topout { matchId, round }` → only the first top-out of the current round counts: the other player wins the round. S→C `round-end { round, winner, wins }`. If `wins[winner] === 2` → S→C `match-end { winner, wins, reason: 'ko' }` and the match closes. Otherwise round + 1 with a new seed: S→C `round-start { round, seed, wins, countdownMs: 3000 }`.
- C→S `match-leave { matchId }` or `disconnect` → S→C `match-end { winner: <other>, wins, reason: 'forfeit' }`.
- When a match closes: both leave the room, back to `idle`, broadcast `lobby-update`.

## Tasks

- [ ] T1 S1 S4 S6 (+ server side of S3 S5) — API: lobby status and disconnect cleanup, challenges, match referee and relays, tests — delegated (writer A)
- [ ] T2 S1 S2 S3 S4 S5 — web: lobby VS and invite, `/match` view on the engine, opponent board, garbage meter, round/match overlays — delegated (writer B)
- [ ] T3 all — two-browser end-to-end check — inline

Route: T1 and T2 are delegated in parallel (Writer trigger: parallelism, disjoint surfaces `apps/api/**` vs `apps/web/**`, plus the long-session context backstop). The parent owns git, this document and the end-to-end check.

## Log

- L1 (2026-10-14) User: "dale, arrancá con el paso 3"
- L2 Step 3 as proposed: "Online: desafío desde el lobby, sala, eventos de basura y snapshots, rondas al mejor de 3."
