import { describe, test, expect } from 'vitest';
import { createInput, press, release, update, DAS, ARR } from '../../src/views/Game/input.js';

const holdFor = (input, totalMs, stepMs = 10) => {
  const actions = [];
  for (let elapsed = 0; elapsed < totalMs; elapsed += stepMs) actions.push(...update(input, stepMs));
  return actions;
};

describe('input layer (S2)', () => {
  test('uses DAS 170 ms and ARR 50 ms', () => {
    expect(DAS).toBe(170);
    expect(ARR).toBe(50);
  });

  test('moves once on press, waits DAS, then repeats every ARR', () => {
    const input = createInput();
    expect(press(input, 'left')).toEqual(['left']);
    expect(holdFor(input, 160)).toEqual([]);
    expect(holdFor(input, 10)).toEqual(['left']); // 170 ms
    expect(holdFor(input, 50)).toEqual(['left']); // 220 ms
    expect(holdFor(input, 100)).toEqual(['left', 'left']); // 320 ms
  });

  test('stops repeating after release', () => {
    const input = createInput();
    press(input, 'right');
    release(input, 'right');
    expect(holdFor(input, 500)).toEqual([]);
  });

  test('the last pressed direction wins while both are held', () => {
    const input = createInput();
    press(input, 'left');
    holdFor(input, 100);
    expect(press(input, 'right')).toEqual(['right']);
    expect(holdFor(input, 300)).not.toContain('left');
  });

  test('soft drop repeats every ARR without the DAS wait', () => {
    const input = createInput();
    expect(press(input, 'softDrop')).toEqual(['softDrop']);
    expect(holdFor(input, 100)).toEqual(['softDrop', 'softDrop']);
  });

  test('rotate, hard drop and hold fire once per press', () => {
    const input = createInput();
    ['rotateCW', 'rotateCCW', 'hardDrop', 'hold'].forEach(action => {
      expect(press(input, action)).toEqual([action]);
    });
    expect(holdFor(input, 1000)).toEqual([]);
  });

  test('ignores the operating system key repeat of a held key', () => {
    const input = createInput();
    press(input, 'hardDrop');
    expect(press(input, 'hardDrop')).toEqual([]);
    release(input, 'hardDrop');
    expect(press(input, 'hardDrop')).toEqual(['hardDrop']);
  });
});
