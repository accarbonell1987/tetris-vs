import { useThemeSwitcher } from '../../hooks'
import ErrorNotification from '../ErrorNotification'

import style from './layout.module.css'

const CustomLayout = ({ children }) => {
  const { theme } = useThemeSwitcher()

  return (
    <div className={`${style.layout} ${style[theme]}`}>
      <ErrorNotification />
      {children}
    </div>
  )
}

export default CustomLayout
