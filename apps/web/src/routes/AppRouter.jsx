import { createBrowserRouter } from 'react-router-dom';

import { Login, Lobby, Game, Match, Errors } from '../views';
import PrivateRoute from './PrivateRoute';
import AppShell from './AppShell';

// esto se captura del objeto de contexto de players
const players = {
  player: {
    id: 1,
    name: 'Tokisha',
    image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    piece: null,
    score: 0,
    lines: 0,
    level: 0,
    lose: false
  },
  enemy: {
    id: 2,
    name: 'Candy',
    image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    piece: null,
    score: 0,
    lines: 0,
    level: 0,
    lose: false
  }
};

// AppShell wraps every screen: invites and match-start are handled wherever the player is.
export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        path: '/',
        element: (
          <PrivateRoute>
            <Lobby />
          </PrivateRoute>
        ),
        errorElement: <Errors />
      },
      {
        path: '/login',
        element: <Login />,
        errorElement: <Errors />
      },
      {
        path: '/game',
        element: <Game {...players} totalScore={3000} />,
        errorElement: <Errors />
      },
      {
        path: '/match',
        element: (
          <PrivateRoute>
            <Match />
          </PrivateRoute>
        ),
        errorElement: <Errors />
      }
    ]
  }
]);
