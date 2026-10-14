import { SHAPES, PIECE_TYPES, getKicks } from './pieces.js';

export { SHAPES, PIECE_TYPES };

export const BOARD_WIDTH = 10;
export const VISIBLE_ROWS = 20;
export const HIDDEN_ROWS = 2; // spawn buffer above the visible field
export const NEXT_COUNT = 5;
export const LOCK_DELAY = 500;
export const MAX_LOCK_RESETS = 15;

// mulberry32: randomness lives in plain state, so the same seed replays the same game.
const random = seed => {
  const nextSeed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(nextSeed ^ (nextSeed >>> 15), 1 | nextSeed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return { value: ((t ^ (t >>> 14)) >>> 0) / 4294967296, seed: nextSeed };
};

// 7-bag: append a shuffled set of all seven pieces whenever the preview runs short.
const fillQueue = player => {
  while (player.queue.length < NEXT_COUNT) {
    const bag = [...PIECE_TYPES];
    for (let index = bag.length - 1; index > 0; index--) {
      const roll = random(player.bagSeed);
      player.bagSeed = roll.seed;
      const swap = Math.floor(roll.value * (index + 1));
      [bag[index], bag[swap]] = [bag[swap], bag[index]];
    }
    player.queue.push(...bag);
  }
};

export const getCells = piece =>
  SHAPES[piece.type][piece.rotation].flatMap((row, y) =>
    row.flatMap((value, x) => (value ? [[piece.x + x, piece.y + y]] : []))
  );

const hitsBoard = (game, piece) =>
  getCells(piece).some(
    ([x, y]) => x < 0 || x >= game.board[0].length || y < 0 || y >= game.board.length || game.board[y][x] !== 0
  );

const hitsOtherPieces = (game, piece, index) => {
  const occupied = new Set(getCells(piece).map(cell => cell.join()));
  return game.players.some(
    (other, otherIndex) =>
      otherIndex !== index && other.active && getCells(other.active).some(cell => occupied.has(cell.join()))
  );
};

const collides = (game, piece, index) => hitsBoard(game, piece) || hitsOtherPieces(game, piece, index);

const topOut = (game, index, events) => {
  game.players[index].active = null;
  game.over = true;
  game.loser = index;
  events.push({ type: 'topOut', player: index });
};

const place = (game, index, type, events) => {
  const player = game.players[index];
  player.active = { type, rotation: 0, x: player.spawnX + (type === 'O' ? 1 : 0), y: 0 };
  Object.assign(player, { lastKick: -1, lockTimer: 0, lockResets: 0, lowestY: 0, gravityTimer: 0 });
  if (hitsBoard(game, player.active)) topOut(game, index, events);
};

const spawnNext = (game, index, events) => {
  const player = game.players[index];
  fillQueue(player);
  const type = player.queue.shift();
  fillQueue(player);
  place(game, index, type, events);
};

const tryMove = (game, index, changes) => {
  const player = game.players[index];
  const candidate = { ...player.active, ...changes };
  if (collides(game, candidate, index)) return false;
  player.active = candidate;
  player.lastKick = -1;
  // Reaching a new lowest row earns a fresh set of lock delay resets.
  if (candidate.y > player.lowestY) Object.assign(player, { lowestY: candidate.y, lockResets: 0 });
  return true;
};

const tryRotate = (game, index, direction) => {
  const player = game.players[index];
  const { active } = player;
  const rotation = (active.rotation + direction + 4) % 4;
  const kicks = getKicks(active.type, active.rotation, rotation);
  for (let kick = 0; kick < kicks.length; kick++) {
    const [offsetX, offsetUp] = kicks[kick];
    const candidate = { ...active, rotation, x: active.x + offsetX, y: active.y - offsetUp };
    if (!collides(game, candidate, index)) {
      player.active = candidate;
      player.lastKick = kick;
      return true;
    }
  }
  return false;
};

const clearLines = game => {
  const remaining = game.board.filter(row => row.includes(0));
  const cleared = game.board.length - remaining.length;
  const empty = Array.from({ length: cleared }, () => Array(BOARD_WIDTH).fill(0));
  game.board = [...empty, ...remaining];
  return cleared;
};

const lockPiece = (game, index, events) => {
  const player = game.players[index];
  const cells = getCells(player.active);
  const value = PIECE_TYPES.indexOf(player.active.type) + 1;
  cells.forEach(([x, y]) => {
    game.board[y][x] = value;
  });
  player.holdUsed = false;
  events.push({ type: 'lock', player: index });

  const lines = clearLines(game);
  if (lines) {
    player.lines += lines;
    events.push({ type: 'clear', player: index, lines });
  } else if (cells.every(([, y]) => y < HIDDEN_ROWS)) {
    return topOut(game, index, events); // lock out
  }
  spawnNext(game, index, events);
};

const hold = (game, index, events) => {
  const player = game.players[index];
  if (player.holdUsed) return;
  const held = player.active.type;
  if (player.hold) place(game, index, player.hold, events);
  else spawnNext(game, index, events);
  player.hold = held;
  player.holdUsed = true;
};

const createPlayer = (seed, spawnX) => ({
  active: null,
  hold: null,
  holdUsed: false,
  queue: [],
  bagSeed: seed,
  spawnX,
  lastKick: -1,
  lockTimer: 0,
  lockResets: 0,
  lowestY: 0,
  gravityTimer: 0,
  lines: 0
});

/**
 * Creates a game. One player = an online board; two players = the local shared board.
 * The default seed is the only impure part: pass a seed to replay or sync a game.
 */
export const createGame = ({
  seed = Math.floor(Math.random() * 2 ** 32),
  players = 1,
  spawnColumns = players === 1 ? [3] : [1, 6]
} = {}) => {
  const game = {
    board: Array.from({ length: VISIBLE_ROWS + HIDDEN_ROWS }, () => Array(BOARD_WIDTH).fill(0)),
    players: spawnColumns.slice(0, players).map(spawnX => createPlayer(seed, spawnX)),
    over: false,
    loser: null
  };
  game.players.forEach((_, index) => spawnNext(game, index, []));
  return game;
};

const ACTIONS = {
  left: (game, index) => tryMove(game, index, { x: game.players[index].active.x - 1 }),
  right: (game, index) => tryMove(game, index, { x: game.players[index].active.x + 1 }),
  softDrop: (game, index) => tryMove(game, index, { y: game.players[index].active.y + 1 }),
  rotateCW: (game, index) => tryRotate(game, index, 1),
  rotateCCW: (game, index) => tryRotate(game, index, -1),
  hold: (game, index, events) => hold(game, index, events),
  hardDrop: (game, index, events) => {
    while (tryMove(game, index, { y: game.players[index].active.y + 1 }));
    const { active } = game.players[index];
    // Only the board is ground: resting on another falling piece never locks mid-air.
    if (hitsBoard(game, { ...active, y: active.y + 1 })) lockPiece(game, index, events);
  }
};

/** Applies one player input. Returns a new game; the input game is never mutated. */
export const act = (game, index, action) => {
  const next = structuredClone(game);
  const events = [];
  if (next.over || !next.players[index].active) return { game: next, events };
  const moved = ACTIONS[action](next, index, events);
  const player = next.players[index];
  // A successful move or rotation while the lock delay runs restarts it, up to MAX_LOCK_RESETS.
  if (moved === true && player.lockTimer > 0) {
    player.lockTimer = 0;
    player.lockResets++;
  }
  return { game: next, events };
};

// Guideline gravity curve: seconds per row = (0.8 - (level - 1) * 0.007) ^ (level - 1).
const gravityInterval = player => {
  const level = Math.min(20, Math.floor(player.lines / 10) + 1);
  return (0.8 - (level - 1) * 0.007) ** (level - 1) * 1000;
};

const applyGravity = (game, index, deltaMs) => {
  const player = game.players[index];
  const interval = gravityInterval(player);
  player.gravityTimer += deltaMs;
  while (player.gravityTimer >= interval) {
    player.gravityTimer -= interval;
    if (!tryMove(game, index, { y: player.active.y + 1 })) {
      player.gravityTimer = 0;
      return;
    }
  }
};

const applyLockDelay = (game, index, deltaMs, events) => {
  const player = game.players[index];
  const { active } = player;
  if (!hitsBoard(game, { ...active, y: active.y + 1 })) {
    player.lockTimer = 0;
    return;
  }
  player.lockTimer += deltaMs;
  if (player.lockTimer >= LOCK_DELAY || player.lockResets >= MAX_LOCK_RESETS) lockPiece(game, index, events);
};

/** Advances time: gravity and lock delay for every player. Returns a new game. */
export const tick = (game, deltaMs) => {
  const next = structuredClone(game);
  const events = [];
  next.players.forEach((player, index) => {
    if (next.over || !player.active) return;
    applyGravity(next, index, deltaMs);
    applyLockDelay(next, index, deltaMs, events);
  });
  return { game: next, events };
};

/** Lowest position the active piece can fall to, for rendering the ghost. */
export const getGhost = (game, index) => {
  const piece = { ...game.players[index].active };
  while (!hitsBoard(game, { ...piece, y: piece.y + 1 })) piece.y++;
  return piece;
};
