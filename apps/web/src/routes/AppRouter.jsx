import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { Login, Lobby, Game, Errors } from '../views'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Lobby />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/game',
    element: <Game />
  }
])