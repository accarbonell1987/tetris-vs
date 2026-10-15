import { createInput, press, release, update } from './input';

/**
 * Gamepads through the browser Gamepad API, standard mapping (DualShock 4 and Xbox-style pads alike).
 * Buttons go through the same DAS/ARR input layer as the keyboard.
 */
const BUTTON_ACTIONS = {
  0: 'rotateCW', // Cross / A
  1: 'rotateCCW', // Circle / B
  2: 'hold', // Square / X
  3: 'hold', // Triangle / Y
  4: 'hold', // L1 / LB
  5: 'hold', // R1 / RB
  9: 'pause', // Options / Start (local mode only)
  12: 'hardDrop', // D-pad up
  13: 'softDrop', // D-pad down
  14: 'left', // D-pad left
  15: 'right' // D-pad right
};
const STICK_DEAD_ZONE = 0.5;

const readActions = pad => {
  const held = new Set();
  pad.buttons.forEach((button, index) => {
    if (button.pressed && BUTTON_ACTIONS[index]) held.add(BUTTON_ACTIONS[index]);
  });
  const [x = 0, y = 0] = pad.axes;
  if (x <= -STICK_DEAD_ZONE) held.add('left');
  if (x >= STICK_DEAD_ZONE) held.add('right');
  if (y >= STICK_DEAD_ZONE) held.add('softDrop');
  return held;
};

export const createGamepadPoller = () => ({ held: [], inputs: [] });

/**
 * Reads every connected pad once per frame. Slot 0 is the first pad by index, slot 1 the second.
 * Returns, per slot, the game actions to run now (new presses plus held repeats) and whether pause was pressed.
 * While `active` is false nothing fires, and buttons held at that moment do not fire later.
 */
export const pollGamepads = (poller, gamepads, deltaMs, active) => {
  const pads = Array.from(gamepads ?? [])
    .filter(Boolean)
    .sort((first, second) => first.index - second.index);
  poller.held.length = Math.min(poller.held.length, pads.length);
  poller.inputs.length = Math.min(poller.inputs.length, pads.length);

  return pads.map((pad, slot) => {
    const input = (poller.inputs[slot] ??= createInput());
    const held = readActions(pad);
    const previous = poller.held[slot] ?? new Set();
    poller.held[slot] = held;

    previous.forEach(action => {
      if (!held.has(action)) release(input, action);
    });
    const pressed = [...held].filter(action => !previous.has(action));
    const pause = pressed.includes('pause');
    if (!active) return { slot, actions: [], pause };

    const repeats = update(input, deltaMs);
    const presses = pressed.filter(action => action !== 'pause').flatMap(action => press(input, action));
    return { slot, actions: [...repeats, ...presses], pause };
  });
};
