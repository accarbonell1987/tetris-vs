import { useTheme } from 'next-themes'

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  const switchTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return { theme, switchTheme }
}

export default ThemeSwitcher
