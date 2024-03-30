import style from './container.module.css'

const CustomContainer = ({ children, theme }) => {
  const containerClassName = `${style.customContainer} ${theme}`

  return <div className={containerClassName}>{children}</div>
}

export default CustomContainer
