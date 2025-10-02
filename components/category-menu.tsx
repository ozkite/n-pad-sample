"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"
import { categories } from "@/lib/data"
import { useTheme } from "@/contexts/theme-context"

interface CategoryMenuProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  setCurrentProjectIndex: () => void
  isSwipingInCategory?: boolean
}

export function CategoryMenu({
  selectedCategory,
  setSelectedCategory,
  setCurrentProjectIndex,
  isSwipingInCategory = false,
}: CategoryMenuProps) {
  const { theme } = useTheme()
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleCategoryClick = (category: string) => {
    if (!isSwipingInCategory || category !== selectedCategory) {
      setSelectedCategory(category)
      setCurrentProjectIndex()
    }
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  if (categories.length === 0) {
    return null
  }

  const visibleCategories = categories

  const LeftArrow = () => {
    if (theme === "nounish") {
      return <div className="pixel-arrow-left" />
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    )
  }

  const RightArrow = () => {
    if (theme === "nounish") {
      return <div className="pixel-arrow-right" />
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
      </svg>
    )
  }

  const getCategoryButtonClass = (isSelected: boolean) => {
    if (theme === "nounish") {
      return cn(
        "px-4 py-2 text-sm whitespace-nowrap flex-shrink-0 font-medium",
        isSelected ? "pixel-button pixel-button-primary" : "pixel-button pixel-button-secondary",
      )
    }
    return cn(
      "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 font-medium shadow-sm",
      isSelected
        ? `bg-[#E53E3E] text-white shadow-lg scale-105 ${isSwipingInCategory ? "ring-2 ring-[#E53E3E] ring-opacity-50" : ""}`
        : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-102",
    )
  }

  const arrowButtonClass =
    theme === "nounish"
      ? "absolute top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-black p-2 transition-all hover:translate-x-[-2px]"
      : "absolute top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700/80 text-white p-1 rounded-full backdrop-blur-sm transition-colors"

  return (
    <div className="relative w-full mb-3">
      <button onClick={scrollLeft} className={cn(arrowButtonClass, "left-0")} aria-label="Scroll left">
        <LeftArrow />
      </button>

      <div
        ref={scrollRef}
        className="flex space-x-3 overflow-x-auto pb-2 px-8 scrollbar-hide scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitScrollbar: { display: "none" },
        }}
      >
        {visibleCategories.map((category) => (
          <button
            key={category}
            className={getCategoryButtonClass(selectedCategory === category)}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <button onClick={scrollRight} className={cn(arrowButtonClass, "right-0")} aria-label="Scroll right">
        <RightArrow />
      </button>

      {theme !== "nounish" && (
        <div className="w-full h-1 bg-gray-800 rounded-full mx-8 mt-2">
          <div
            className={cn(
              "h-1 bg-[#E53E3E] rounded-full transition-all duration-300 shadow-sm",
              isSwipingInCategory && "animate-pulse",
            )}
            style={{
              width: `${Math.min(100, (100 / visibleCategories.length) * 3)}%`,
              marginLeft: `${(selectedCategory ? categories.indexOf(selectedCategory) : 0) * (100 / visibleCategories.length)}%`,
            }}
          ></div>
        </div>
      )}
    </div>
  )
}
