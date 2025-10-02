"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type ThemeType = "default" | "nounish" | "theme3"

interface ThemeContextType {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("default")

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("app-theme") as ThemeType
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem("app-theme", theme)

    // Apply theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, "")
    document.body.classList.add(`theme-${theme}`)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
