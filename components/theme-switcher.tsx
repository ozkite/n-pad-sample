"use client"

import { useTheme, type ThemeType } from "@/contexts/theme-context"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const themes: { id: ThemeType; label: string }[] = [
    { id: "default", label: "1" },
    { id: "nounish", label: "2" },
    { id: "theme3", label: "3" },
  ]

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`
            w-10 h-10 flex items-center justify-center
            font-bold text-lg transition-all
            ${theme === t.id ? "theme-switcher-active" : "theme-switcher-inactive"}
          `}
          style={{
            fontFamily: "'Press Start 2P', 'Silkscreen', monospace",
            fontSize: "16px",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
