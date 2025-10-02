"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"

interface ToggleMenuProps {
  viewMode: "swipe" | "list"
  setViewMode: (mode: "swipe" | "list") => void
}

export function ToggleMenu({ viewMode, setViewMode }: ToggleMenuProps) {
  const { theme } = useTheme()

  if (theme === "nounish") {
    return (
      <div className="flex justify-center w-full mb-4 gap-3">
        <button
          className={cn("pixel-button", viewMode === "swipe" ? "pixel-button-primary" : "pixel-button-secondary")}
          onClick={() => setViewMode("swipe")}
        >
          Swipe
        </button>
        <button
          className={cn("pixel-button", viewMode === "list" ? "pixel-button-primary" : "pixel-button-secondary")}
          onClick={() => setViewMode("list")}
        >
          View All
        </button>
      </div>
    )
  }

  return (
    <div className="flex justify-center w-full mb-4">
      <div className="flex p-1 bg-gray-700/30 rounded-full">
        <button
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            viewMode === "swipe" ? "bg-gray-800 text-white font-bold" : "bg-transparent text-gray-400",
          )}
          onClick={() => setViewMode("swipe")}
        >
          Swipe
        </button>
        <button
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            viewMode === "list" ? "bg-gray-800 text-white font-bold" : "bg-transparent text-gray-400",
          )}
          onClick={() => setViewMode("list")}
        >
          View All
        </button>
      </div>
    </div>
  )
}
