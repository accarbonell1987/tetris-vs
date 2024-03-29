import React from 'react'
import { useThemeSwitcher } from '../../hooks'

const Login = () => {
  const { theme, switchTheme } = useThemeSwitcher()

  return (
    <div>
      <h1>Change Theme</h1>
      <button type="button" onClick={() => switchTheme()}>
        Cambiar
      </button>
    </div>
  )
}

export default Login
