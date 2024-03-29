import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { Login, Lobby, Errors } from '../views'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Lobby />
  },
  {
    path: '/login',
    element: <Login />
  }
])
