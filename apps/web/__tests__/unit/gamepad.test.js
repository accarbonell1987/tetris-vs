import { describe, test, expect } from 'vitest';
import { createGamepadPoller, pollGamepads } from '../../src/views/Game/gamepad.js';
import { DAS, ARR } from '../../src/views/Game/input.js';

// A standard-mapping pad (17 buttons, 4 axes) with the given buttons pressed.
const pad = (index, { buttons = [], axes = [0, 0, 0, 0] } = {}) => ({
  index,
  mapping: 'standard',
  axes,
  buttons: Array.from({ length: 17 }, (_, button) => ({ pressed: buttons.includes(button) }))
});

const DPAD_LEFT = 14;
const DPAD_UP = 12;
const CROSS = 0;
const CIRCLE = 1;
const L1 = 4;
const OPTIONS = 9;

describe('gamepads', () => {
  test('a press fires once and holding repeats with the keyboard DAS/ARR', () => {
    const poller = createGamepadPoller();
    expect(pollGamepads(poller, [pad(0, { buttons: [DPAD_LEFT] })], 16, true)[0].actions).toEqual(['left']);
    let repeats = [];
    for (let elapsed = 0; elapsed < DAS + ARR; elapsed += 10) {
      repeats = repeats.concat(pollGamepads(poller, [pad(0, { buttons: [DPAD_LEFT] })], 10, true)[0].actions);
    }
    expect(repeats).toEqual(['left', 'left']);
    expect(pollGamepads(poller, [pad(0)], 500, true)[0].actions).toEqual([]);
  });

  test('buttons map to rotate, hold and hard drop, and fire once per press', () => {
    const poller = createGamepadPoller();
    const first = pollGamepads(poller, [pad(0, { buttons: [CROSS, CIRCLE, L1, DPAD_UP] })], 16, true)[0];
    expect(first.actions.sort()).toEqual(['hardDrop', 'hold', 'rotateCCW', 'rotateCW']);
    expect(pollGamepads(poller, [pad(0, { buttons: [CROSS, CIRCLE, L1, DPAD_UP] })], 1000, true)[0].actions).toEqual([]);
  });

  test('the left stick moves and soft drops past a dead zone', () => {
    expect(pollGamepads(createGamepadPoller(), [pad(0, { axes: [0.9, 0, 0, 0] })], 16, true)[0].actions).toEqual(['right']);
    expect(pollGamepads(createGamepadPoller(), [pad(0, { axes: [0, 0.9, 0, 0] })], 16, true)[0].actions).toEqual(['softDrop']);
    expect(pollGamepads(createGamepadPoller(), [pad(0, { axes: [0.3, 0.3, 0, 0] })], 16, true)[0].actions).toEqual([]);
  });

  test('pads are ordered by index into slots: the first one is player 1, the second player 2', () => {
    const results = pollGamepads(createGamepadPoller(), [null, pad(3, { buttons: [CROSS] }), pad(1, { buttons: [DPAD_LEFT] })], 16, true);
    expect(results).toEqual([
      { slot: 0, actions: ['left'], pause: false },
      { slot: 1, actions: ['rotateCW'], pause: false }
    ]);
  });

  test('Options / Start reports pause once and is not a game action', () => {
    const poller = createGamepadPoller();
    expect(pollGamepads(poller, [pad(0, { buttons: [OPTIONS] })], 16, true)[0]).toEqual({ slot: 0, actions: [], pause: true });
    expect(pollGamepads(poller, [pad(0, { buttons: [OPTIONS] })], 16, true)[0].pause).toBe(false);
  });

  test('while the game is not active nothing fires, and a held button does not fire on resume', () => {
    const poller = createGamepadPoller();
    expect(pollGamepads(poller, [pad(0, { buttons: [DPAD_UP] })], 16, false)[0].actions).toEqual([]);
    expect(pollGamepads(poller, [pad(0, { buttons: [DPAD_UP] })], 16, true)[0].actions).toEqual([]);
  });

  test('no pads (or no Gamepad API) is fine', () => {
    expect(pollGamepads(createGamepadPoller(), undefined, 16, true)).toEqual([]);
    expect(pollGamepads(createGamepadPoller(), [null, null], 16, true)).toEqual([]);
  });
});
