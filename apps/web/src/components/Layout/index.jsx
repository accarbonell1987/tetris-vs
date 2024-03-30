import { useThemeSwitcher } from '../../hooks'

import style from './layout.module.css'

const CustomLayout = ({ children }) => {
  const { theme } = useThemeSwitcher()

  return <div className={`${style.layout} ${style[theme]}`}>{children}</div>
}

export default CustomLayout
