# pure-engine

Objective: a pure, deterministic, framework-free Tetris engine in `packages/shared` used by both the online (separate boards) and local (shared board) modes.
Branch: `feat/pure-engine` (from `front-web`). Delivery: ask-on-risk; chain strategy asked before PR creation. Test runner: `node --test` (Node 24, no new deps).

## Specs

- S1 Randomizer: 7-bag, seeded and deterministic (same seed → same sequence), so both online clients can share a sequence.
- S2 Rotation: "Rotación SRS en los dos sentidos" — SRS kick tables for JLSTZ and I; O does not kick.
- S3 Movement: left, right, soft drop, "Hard drop".
- S4 Gravity by level and "Lock delay de 500 ms con hasta 15 resets".
- S5 Hold: "hold una vez por pieza".
- S6 Ghost piece position.
- S7 "5 piezas en la cola de siguientes".
- S8 Board "10x20 en vez de 10x18" (plus a hidden spawn buffer); line clear; top-out: "Top-out = una pieza nueva no entra o la basura empuja bloques por encima del techo."
- S9 Attack table: "1 → 0, 2 → 1, 3 → 2, 4 → 4 (Tetris), T-spin doble → 4".
- S10 "Combo: limpiar en turnos seguidos suma" and "B2B: Tetris/T-spin seguidos → +1".
- S11 "Cancel: tu ataque resta tu basura pendiente".
- S12 "Delay: la basura sube tras ~0.5 s (o al fijar)" and "Basura = filas grises con un hueco."
- S13 Local shared board: two active pieces on one board.
- S14 Local scoring: "Meta: 3000 puntos", "Línea completada → puntos para quien fijó la última pieza que la cerró. 1 línea → 100, 2 líneas → 300, 3 líneas → 500, 4 líneas → 800", "Si el tablero se llena: pierde quien lo llenó (su pieza no entró)."

Assumptions (marked, not user requirements):
- A1 DAS 170 ms / ARR 50 ms belong to the input layer (step 2), not the engine; the engine moves one cell per action.
- A2 Garbage model (S12): incoming garbage waits 500 ms, then rises when the receiver locks a piece that clears no lines (TETR.IO style). One hole column per incoming attack.
- A3 T-spin detection: 3-corner rule; mini unless both front corners are filled or the last SRS kick was used. T-spin full 1/2/3 → 2/4/6, mini → 0/1. Combo bonus table [0,0,1,1,2,2,3,3,4,4,4,5].
- A4 Shared board: another player's falling piece blocks movement but is not ground, so nothing locks mid-air on it (fixes current bug). Spawn blocked only by another falling piece waits instead of topping out.
- A5 Gravity: Guideline curve (0.8 − (level−1)·0.007)^(level−1) s/row, level = floor(lines/10)+1, capped at 20.
- A6 Lock delay counter resets when the piece reaches a new lowest row; after 15 resets a grounded piece locks immediately.

## Tasks

- [x] T1 S1 S2 S3 S5 S6 S7 S8 — scaffold, pieces/SRS, bag, movement, hold, ghost, queue — inline
- [ ] T2 S4 S8 — gravity, lock delay, line clear, top-out, levels — inline
- [ ] T3 S9 S10 S11 S12 — T-spin, combo, B2B, garbage queue/cancel/delay — inline
- [ ] T4 S13 S14 — shared board players, score race, target win — inline

Route: all inline (no Writer trigger: units share `engine.js`, so no disjoint parallel surfaces).

## Log

- L1 (2026-10-14) User: "dale, arrancá con el motor puro"
- L2 Decisions from this session (Engram decision/*): online separate boards + local shared board; Guideline attack; KO best of 3 (network layer, step 3); local score race to 3000.
- L3 Forecast ~1000 authored lines (engine + tests) > 400: delivery chain strategy will be asked once before opening a PR. RDD is off (global), no native review.
