# @tetris/shared

Pure, deterministic Tetris engine. No canvas, no React, no timers: the caller owns the clock and the input.

```js
import { createGame, act, tick, receiveGarbage, getGhost, getCells } from '@tetris/shared';

let game = createGame({ seed: 42 });                                // online: one board per client
let local = createGame({ seed: 42, players: 2, targetScore: 3000 }); // local: shared board

({ game, events } = act(game, 0, 'rotateCW')); // left | right | softDrop | hardDrop | rotateCW | rotateCCW | hold
({ game, events } = tick(game, deltaMs));      // gravity, lock delay, garbage timers
({ game } = receiveGarbage(game, 0, lines));   // opponent attack
```

Every call returns a new `game`; the input is never mutated.

Events: `lock`, `clear` (`lines`, `points`, `tSpin`, `combo`, `backToBack`, `attack`, `sent`), `topOut`, `win`.
Online, send `clear.sent` to the opponent, who applies it with `receiveGarbage`.

Rules: 10x20 board plus 2 hidden rows, 7-bag, SRS, 5-piece preview, hold once per piece,
500 ms lock delay with 15 resets, Guideline gravity, Guideline attack with Tetris 99 combos,
garbage that rises 500 ms later on a non-clearing lock. Board cells: 0 empty, 1-7 piece (`PIECE_TYPES` order), 8 garbage.

Tests: `npm test` (runs `node --test`).
