import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDarkTheme = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={
        isDarkTheme ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'
      }
      title={isDarkTheme ? 'Светлая тема' : 'Тёмная тема'}
    >
      {isDarkTheme ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  )
}
