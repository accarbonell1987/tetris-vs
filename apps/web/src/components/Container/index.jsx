import useDarkMode from 'use-dark-mode'

import style from './container.module.css'

const CustomContainer = ({ children }) => {
  const darkMode = useDarkMode()

  const containerClassName = `${style.customContainer} ${
    'theme' + darkMode.value ? 'Dark' : 'Light'
  }`

  return <div className={containerClassName}>{children}</div>
}

export default CustomContainer
