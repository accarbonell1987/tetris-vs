import { test, expect, beforeEach, afterEach } from 'vitest';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import AppShell from '../../src/routes/AppShell';
import useGlobalStore from '../../src/store/useGlobalStore';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const createFakeSocket = () => {
  const handlers = {};
  return {
    emitted: [],
    on: (event, handler) => {
      handlers[event] = handler;
    },
    off: (event, handler) => {
      if (handlers[event] === handler) delete handlers[event];
    },
    emit(event, payload) {
      this.emitted.push([event, payload]);
    },
    receive: (event, payload) => act(() => handlers[event]?.(payload))
  };
};

const matchStart = {
  matchId: 'm1',
  players: [
    { id: 'a', name: 'Ana', image: 'a.svg' },
    { id: 'b', name: 'Beto', image: 'b.svg' }
  ],
  round: 1,
  seed: 7,
  wins: { a: 0, b: 0 },
  countdownMs: 3000
};

let root;
let router;
let socket;

beforeEach(() => {
  socket = createFakeSocket();
  useGlobalStore.setState({ socket, player: { id: 'b', name: 'Beto', loggedIn: true }, match: null, notice: null });
  router = createMemoryRouter(
    [
      {
        element: <AppShell />,
        children: [
          { path: '/game', element: <p>local game</p> },
          { path: '/match', element: <p>online match</p> }
        ]
      }
    ],
    { initialEntries: ['/game'] }
  );
  root = createRoot(document.createElement('div'));
  act(() => root.render(<RouterProvider router={router} />));
});

afterEach(() => {
  act(() => root.unmount());
  useGlobalStore.setState({ socket: null, player: null, match: null, notice: null });
});

test('an invite received outside the lobby shows the challenge', () => {
  socket.receive('challenge-received', { from: { id: 'a', name: 'Ana', image: 'a.svg' } });
  expect(document.body.textContent).toContain('¡Te desafían!');
  expect(document.body.textContent).toContain('Ana');
});

test('match-start from any screen stores the match and opens /match', () => {
  socket.receive('challenge-received', { from: { id: 'a', name: 'Ana', image: 'a.svg' } });
  useGlobalStore.setState({ notice: 'Desafío enviado a Ana' });
  socket.receive('match-start', matchStart);
  expect(useGlobalStore.getState().match).toEqual(matchStart);
  expect(router.state.location.pathname).toBe('/match');
  expect(useGlobalStore.getState().notice).toBeNull();
});

test('declines and challenge errors become the lobby notice', () => {
  socket.receive('challenge-declined', { by: { id: 'a', name: 'Ana' } });
  expect(useGlobalStore.getState().notice).toBe('Ana rechazó tu desafío');
  socket.receive('challenge-error', { message: 'Jugador no encontrado' });
  expect(useGlobalStore.getState().notice).toBe('Jugador no encontrado');
});

test('lobby updates keep the player list fresh on every screen', () => {
  const players = [{ id: 'a', name: 'Ana', image: 'a.svg', status: 'idle' }];
  socket.receive('lobby-update', players);
  expect(useGlobalStore.getState().players).toEqual(players);
});
