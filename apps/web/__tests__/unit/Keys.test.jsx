import { test, expect, afterEach, vi } from 'vitest';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import Keys from '../../src/views/Game/components/Keys';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let root;
let container;

const renderKeys = props => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<Keys show {...props} />));
};

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

test('buttons report press and release, so held moves can repeat', () => {
  const onPress = vi.fn();
  const onRelease = vi.fn();
  renderKeys({ onPress, onRelease });
  const button = container.querySelector('button[aria-label="Mover a la izquierda"]');
  act(() => button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch', isPrimary: true, button: 0 })));
  expect(onPress).toHaveBeenCalledWith('left');
  act(() => button.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch', isPrimary: true, button: 0 })));
  expect(onRelease).toHaveBeenCalledWith('left');
});

test('every game action has a button: hold, hard drop, moves, soft drop and both rotations', () => {
  renderKeys({ onPress: vi.fn() });
  const labels = [...container.querySelectorAll('button')].map(button => button.getAttribute('aria-label'));
  expect(labels).toEqual(
    expect.arrayContaining(['Guardar pieza', 'Soltar', 'Mover a la izquierda', 'Bajar', 'Mover a la derecha', 'Girar a la derecha', 'Girar a la izquierda'])
  );
});

test('without onPause (online) there is no pause button', () => {
  renderKeys({ onPress: vi.fn() });
  expect(container.querySelector('button[aria-label="Pausa"]')).toBeNull();
});

test('with onPause (local) the pause button pauses', () => {
  const onPause = vi.fn();
  renderKeys({ onPress: vi.fn(), onPause });
  act(() => container.querySelector('button[aria-label="Pausa"]').click());
  expect(onPause).toHaveBeenCalled();
});
