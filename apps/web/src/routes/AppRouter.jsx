import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { Login, Lobby, Game, Errors } from '../views'

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
    element: <Game />,
    errorElement: <Errors />
  }
])
