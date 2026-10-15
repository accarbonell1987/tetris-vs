# Socket.IO protocol

Every real-time message between `apps/web` and `apps/api`. The server is a relay and match referee: it never runs the engine. Each client simulates its own board with `@tetris/shared` and is trusted (no anti-cheat yet).

C→S = client to server, S→C = server to client. The server ignores malformed payloads silently.

## Lobby

| Event          | Direction | Payload                           | Notes                                                                                                                                                                                                     |
| -------------- | --------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lobby-join`   | C→S       | `{ player: { id, name, image } }` | Sent after login, after a page refresh and after every Socket.IO auto-reconnect. Status is `playing` if the player is in a match, `idle` otherwise.                                                       |
| `lobby-update` | S→C (all) | `[{ id, name, image, status }]`   | `status` is `idle` or `playing`. Broadcast on every lobby change.                                                                                                                                         |
| `lobby-leave`  | C→S       | `{ player: { id } }`              | Removes the player from the list.                                                                                                                                                                         |
| `disconnect`   | —         | —                                 | Drops the player's pending challenges and forfeits their match. The player leaves the list only when none of their sockets is still connected (a refresh opens the new socket before the old one closes). |

## Challenges

| Event                | Direction        | Payload                         | Notes                                                                                                                                     |
| -------------------- | ---------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `challenge-send`     | C→S              | `{ to }` (player id)            | One pending challenge per challenger. Invalid (unknown target, yourself, either player not `idle`) → `challenge-error` to the challenger. |
| `challenge-received` | S→C (target)     | `{ from: { id, name, image } }` | Shown as a modal on any screen.                                                                                                           |
| `challenge-accept`   | C→S              | `{ from }` (challenger id)      | Starts the match when the challenge is still pending and both are `idle`; otherwise `challenge-error` to the acceptor.                    |
| `challenge-decline`  | C→S              | `{ from }`                      | → `challenge-declined` to the challenger.                                                                                                 |
| `challenge-declined` | S→C (challenger) | `{ by: { id, name } }`          |                                                                                                                                           |
| `challenge-error`    | S→C              | `{ message }`                   | Spanish text, shown as is. Also sent to a challenger whose invite was replaced by a newer one to the same target.                         |

Starting a match drops every pending challenge of both players.

## Match

Each match has a room `match:<matchId>`. Both players become `playing` and the lobby is broadcast.

| Event           | Direction      | Payload                                                                                                | Notes                                                                                           |
| --------------- | -------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `match-start`   | S→C (both)     | `{ matchId, players: [{ id, name, image }, …], round: 1, seed, wins: { [id]: 0 }, countdownMs: 3000 }` | Round 1 is included, so the client can start right away.                                        |
| `match-garbage` | C→S            | `{ matchId, round, lines }`                                                                            | The `sent` of a `clear` event. Relayed only for the current round and integer `lines` 1..20.    |
| `match-garbage` | S→C (opponent) | `{ round, lines }`                                                                                     | Applied with `receiveGarbage`.                                                                  |
| `match-board`   | C→S            | `{ matchId, round, board }`                                                                            | At most every 100 ms, falling piece drawn in. `board`: up to 22 rows of up to 10 integers 0..8. |
| `match-board`   | S→C (opponent) | `{ round, board }`                                                                                     | Drawn as the opponent board.                                                                    |
| `match-topout`  | C→S            | `{ matchId, round }`                                                                                   | Only the first top-out of the current round counts: the other player wins the round.            |
| `round-end`     | S→C (both)     | `{ round, winner, wins }`                                                                              | The client keeps the result on screen for 2 s.                                                  |
| `round-start`   | S→C (both)     | `{ round, seed, wins, countdownMs: 3000 }`                                                             | Sent with `round-end` when nobody has 2 wins. Same seed for both players, new seed per round.   |
| `match-end`     | S→C (both)     | `{ winner, wins, reason }`                                                                             | `reason` is `ko` (2 round wins) or `forfeit`.                                                   |
| `match-leave`   | C→S            | `{ matchId }`                                                                                          | Forfeit ("Abandonar"). A disconnect forfeits too.                                               |

When a match ends, both players leave the room, go back to `idle` and the lobby is broadcast.
