import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type AppTheme = 'light' | 'dark'

type ThemeContextValue = {
  theme: AppTheme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const THEME_STORAGE_KEY = 'app-theme'

const getInitialTheme = (): AppTheme => {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return 'dark'
}

const applyTheme = (theme: AppTheme) => {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  document.body.classList.remove('light-theme', 'dark-theme')
  document.body.classList.add(`${theme}-theme`)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', theme === 'light' ? '#e6e9f0' : '#0a0c10')
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>(getInitialTheme)

  const toggleTheme = () => {
    const nextTheme: AppTheme = theme === 'light' ? 'dark' : 'light'

    const run = () => {
      setTheme(nextTheme)
      applyTheme(nextTheme)
    }

    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(run)
    } else {
      run()
    }
  }

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
