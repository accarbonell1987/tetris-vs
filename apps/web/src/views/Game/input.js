/**
 * Keyboard repeat for one player: a held key repeats on the game clock, not the OS key repeat.
 * Left/right move once, wait DAS, then repeat every ARR. Soft drop repeats every ARR.
 * Everything else fires once per press.
 */
export const DAS = 170;
export const ARR = 50;

const REPEAT_DELAY = { left: DAS, right: DAS, softDrop: ARR };

// Automatic repeats that happened after holding a key for `elapsed` ms.
const repeatsAt = (elapsed, delay) => (elapsed < delay ? 0 : Math.floor((elapsed - delay) / ARR) + 1);

export const createInput = () => ({ held: {}, direction: null });

export const press = (input, action) => {
  if (action in input.held) return [];
  input.held[action] = 0;
  if (action === 'left' || action === 'right') input.direction = action;
  return [action];
};

export const release = (input, action) => {
  delete input.held[action];
  if (input.direction === action) {
    input.direction = ['left', 'right'].find(direction => direction in input.held) ?? null;
  }
};

export const update = (input, deltaMs) =>
  Object.keys(input.held).flatMap(action => {
    const delay = REPEAT_DELAY[action];
    const blocked = (action === 'left' || action === 'right') && action !== input.direction;
    if (!delay || blocked) return [];
    const before = input.held[action];
    input.held[action] = before + deltaMs;
    return Array(repeatsAt(before + deltaMs, delay) - repeatsAt(before, delay)).fill(action);
  });
