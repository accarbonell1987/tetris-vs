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

test('the hold button sends the hold action', () => {
  const onAction = vi.fn();
  renderKeys({ onAction });
  act(() => container.querySelector('button[aria-label="Guardar pieza"]').click());
  expect(onAction).toHaveBeenCalledWith('hold');
});

test('without onPause (online) there is no pause button', () => {
  renderKeys({ onAction: vi.fn() });
  expect(container.querySelector('button[aria-label="Pausa"]')).toBeNull();
});

test('with onPause (local) the pause button pauses', () => {
  const onPause = vi.fn();
  renderKeys({ onAction: vi.fn(), onPause });
  act(() => container.querySelector('button[aria-label="Pausa"]').click());
  expect(onPause).toHaveBeenCalled();
});
