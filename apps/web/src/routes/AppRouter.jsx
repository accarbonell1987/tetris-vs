import { createBrowserRouter } from 'react-router-dom';

import { Login, Lobby, Game, Errors } from '../views';

// esto se captura del objeto de contexto de players
const players = {
  player1: {
    name: 'Tokisha',
    image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    piece: null,
    score: 0,
    lines: 0,
    level: 0,
    lose: false
  },
  player2: {
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
    element: <Lobby />,
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
