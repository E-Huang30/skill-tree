import { createContext, useContext, useState } from 'react'

const Ctx = createContext({ isDark: true, toggleTheme: () => {} })

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    const dark = saved !== 'light'
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    return dark
  })

  function toggleTheme() {
    setIsDark(v => {
      const next = !v
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  return <Ctx.Provider value={{ isDark, toggleTheme }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)
