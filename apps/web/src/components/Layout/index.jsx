import useDarkMode from 'use-dark-mode'
import { NextUIProvider } from '@nextui-org/react'

import { CustomContainer } from '..'

import style from './layout.module.css'

const CustomLayout = ({ children }) => {
  const darkMode = useDarkMode(false)

  const lightTheme = createTheme({
    type: 'light'
  })

  const darkTheme = createTheme({
    type: 'dark'
  })

  return (
    <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
      <div className={style.customLayout}>
        <CustomContainer>{children}</CustomContainer>
      </div>
    </NextUIProvider>
  )
}

export default CustomLayout
