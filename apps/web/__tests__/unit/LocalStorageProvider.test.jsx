import { test, expect, afterEach } from 'vitest';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import LocalStorageProvider from '../../src/providers/LocalStorageProvider';
import useGlobalStore from '../../src/store/useGlobalStore';
import { StorageService } from '../../src/services/localStorageService';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  localStorage.clear();
  useGlobalStore.setState({ player: null });
});

test('restores the stored session once, without a render loop', () => {
  const user = { id: 'abc', name: 'Tester', image: 'avatar.svg', loggedIn: true };
  StorageService.setItem('tetris', { user, saveTime: Date.now() });

  let renders = 0;
  const PlayerReader = () => {
    renders++;
    useGlobalStore(state => state.player);
    return null;
  };

  const root = createRoot(document.createElement('div'));
  act(() =>
    root.render(
      <LocalStorageProvider>
        <PlayerReader />
      </LocalStorageProvider>
    )
  );

  expect(useGlobalStore.getState().player).toEqual(user);
  expect(renders).toBeLessThan(5);
  act(() => root.unmount());
});
