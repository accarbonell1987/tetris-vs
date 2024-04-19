import { createBrowserRouter } from 'react-router-dom';

import { Login, Lobby, Game, Errors } from '../views';
import PrivateRoute from './PrivateRoute';

// esto se captura del objeto de contexto de players
const players = {
  player: {
    name: 'Tokisha',
    image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    piece: null,
    score: 0,
    lines: 0,
    level: 0,
    lose: false
  },
  enemy: {
    name: 'Candy',
    image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    piece: null,
    score: 0,
    lines: 0,
    level: 0,
    lose: false
  }
};

export const router = createBrowserRouter([
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
  }
]);
