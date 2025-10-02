"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Heart, MessageCircle, Flag, Zap, ExternalLink, X, ThumbsUp } from "lucide-react"
import { BoostModal } from "@/components/boost-modal"
import { ShareModal } from "@/components/share-modal"
import { ReportModal } from "@/components/report-modal"
import { CommentModal } from "@/components/comment-modal"
import type { Project } from "@/lib/data"
import type { DonationAmount, StableCoin } from "@/components/amount-selector"

interface ProjectCardProps {
  project: Project
  viewMode?: "swipe" | "category"
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onDonate?: (amount?: number) => void
  onShare?: () => void
  onBoost?: (amount: number) => void
  donationAmount?: DonationAmount
  donationCurrency?: StableCoin
}

// Custom X (Twitter) Icon Component
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// Website Icon Component
function WebsiteIcon({ className }: { className?: string }) {
  return (
    <img
      src="/images/red-nouns-lens.png"
      alt="Website"
      className={`${className} rounded-full`}
      style={{ width: "16px", height: "16px" }}
    />
  )
}

export function ProjectCard({
  project,
  viewMode = "swipe",
  onSwipeLeft,
  onSwipeRight,
  onDonate,
  onShare,
  onBoost,
  donationAmount,
  donationCurrency,
}: ProjectCardProps) {
  const [isLiked, setIsLiked] = useState(project.userHasLiked || false)
  const [likeCount, setLikeCount] = useState(project.likes || 0)
  const [showBoostModal, setShowBoostModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [commentCount, setCommentCount] = useState(project.comments || 0)
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Touch/swipe handling
  const cardRef = useRef<HTMLDivElement>(null)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [dragThreshold] = useState(50) // Minimum distance to trigger swipe

  // Cleanup effect for mouse events
  useEffect(() => {
    return () => {
      // Cleanup any remaining event listeners
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [])

  // Separate handlers for heart and like button
  const handleHeartLike = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleProjectLike = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    console.log("[v0] Project liked:", project.name)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleBoost = (amount: number) => {
    if (onBoost) {
      onBoost(amount)
    }
  }

  const handleExternalLink = (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (url === "NA") {
      return // Don't open link if it's NA
    }
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleReport = (reason: string, customReason?: string) => {
    console.log(`Reporting ${project.name}: ${reason}`, customReason)
    alert(`Thank you for your report. We'll review ${project.name} for: ${reason}`)
  }

  const handleComment = (comment: string) => {
    console.log(`Comment on ${project.name}:`, comment)
    setCommentCount(commentCount + 1)
    alert(`Comment posted: "${comment}"`)
  }

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault()
    e.stopPropagation()
    action()
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (viewMode !== "swipe") return
    const touch = e.touches[0]
    setStartX(touch.clientX)
    setStartY(touch.clientY)
    setCurrentX(touch.clientX)
    setIsDragging(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (viewMode !== "swipe") return
    const touch = e.touches[0]
    setCurrentX(touch.clientX)
    const diffX = touch.clientX - startX
    const diffY = touch.clientY - startY

    // Only start dragging if horizontal movement is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      setIsDragging(true)
      e.preventDefault() // Prevent scrolling when swiping horizontally
    }

    if (cardRef.current && isDragging) {
      const rotation = diffX * 0.1
      const opacity = Math.max(0.7, 1 - Math.abs(diffX) / 300)
      cardRef.current.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`
      cardRef.current.style.opacity = opacity.toString()
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging || viewMode !== "swipe") {
      if (cardRef.current) {
        cardRef.current.style.transform = ""
        cardRef.current.style.opacity = "1"
      }
      setIsDragging(false)
      return
    }

    const diffX = currentX - startX

    if (cardRef.current) {
      cardRef.current.style.transform = ""
      cardRef.current.style.opacity = "1"
    }

    if (Math.abs(diffX) > dragThreshold) {
      if (diffX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (diffX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }

    setStartX(0)
    setStartY(0)
    setCurrentX(0)
    setIsDragging(false)
  }

  // Completely rewritten mouse drag functionality
  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!isMouseDown || viewMode !== "swipe") return

    const diffX = e.clientX - startX
    const diffY = e.clientY - startY

    // Only start dragging if horizontal movement is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      setIsDragging(true)
    }

    if (cardRef.current && Math.abs(diffX) > 10) {
      const rotation = diffX * 0.1
      const opacity = Math.max(0.7, 1 - Math.abs(diffX) / 300)
      cardRef.current.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`
      cardRef.current.style.opacity = opacity.toString()
      cardRef.current.style.cursor = "grabbing"
      console.log("[v0] Mouse dragging:", diffX)
    }
  }

  const handleGlobalMouseUp = (e: MouseEvent) => {
    if (!isMouseDown) return

    const diffX = e.clientX - startX

    if (cardRef.current) {
      cardRef.current.style.transform = ""
      cardRef.current.style.opacity = "1"
      cardRef.current.style.cursor = "grab"
    }

    if (isDragging && Math.abs(diffX) > dragThreshold) {
      console.log("[v0] Mouse swipe triggered:", diffX)
      if (diffX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (diffX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }

    setIsDragging(false)
    setIsMouseDown(false)

    // Remove event listeners
    document.removeEventListener("mousemove", handleGlobalMouseMove)
    document.removeEventListener("mouseup", handleGlobalMouseUp)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode !== "swipe") return
    e.preventDefault()

    setStartX(e.clientX)
    setStartY(e.clientY)
    setIsMouseDown(true)
    setIsDragging(false)

    console.log("[v0] Mouse down at:", e.clientX)

    // Add global event listeners
    document.addEventListener("mousemove", handleGlobalMouseMove)
    document.addEventListener("mouseup", handleGlobalMouseUp)
  }

  // Better fallback image logic
  const getImageSrc = () => {
    if (imageError || !project.imageUrl || project.imageUrl === "NA") {
      return `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(project.name + " " + project.category)}`
    }
    return project.imageUrl
  }

  const cardContent = (
    <div
      ref={cardRef}
      className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-700 select-none cursor-grab active:cursor-grabbing"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      style={{ touchAction: "pan-y" }} // Allow vertical scrolling but handle horizontal swipes
    >
      {/* Project Image */}
      <div className="relative h-48 bg-gray-700">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E53E3E]"></div>
          </div>
        )}

        <img
          src={getImageSrc() || "/placeholder.svg"}
          alt={project.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
          draggable={false}
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">{project.category}</span>
        </div>

        {/* Boost Badge */}
        {project.boostAmount && project.boostAmount > 0 && (
          <div className="absolute top-3 right-3">
            <div className="bg-[#E53E3E] text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Boosted</span>
            </div>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{project.name}</h3>
            <p className="text-gray-300 text-sm line-clamp-2 mb-2">
              {project.description || "No description available"}
            </p>
          </div>
        </div>

        {/* Social Links - Always show with NA if not available */}
        <div className="flex items-center space-x-3 mb-3">
          <button
            onClick={(e) => handleExternalLink(e, project.website || "NA")}
            className={`flex items-center space-x-1 transition-colors ${
              project.website && project.website !== "NA"
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 cursor-not-allowed"
            }`}
            disabled={!project.website || project.website === "NA"}
          >
            <WebsiteIcon className="w-4 h-4" />
            <span className="text-xs">{project.website && project.website !== "NA" ? "Website" : "NA"}</span>
          </button>

          <button
            onClick={(e) => handleExternalLink(e, project.twitter || "NA")}
            className={`flex items-center space-x-1 transition-colors ${
              project.twitter && project.twitter !== "NA"
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 cursor-not-allowed"
            }`}
            disabled={!project.twitter || project.twitter === "NA"}
          >
            <XIcon className="w-4 h-4" />
            <span className="text-xs">{project.twitter && project.twitter !== "NA" ? "Follow" : "NA"}</span>
          </button>
        </div>

        {/* Interaction Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Like Button - Heart only for visual feedback */}
            <button
              onClick={handleHeartLike}
              className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-red-400 text-red-400" : ""}`} />
              <span className="text-xs">{likeCount}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={(e) => handleButtonClick(e, () => setShowCommentModal(true))}
              className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">{commentCount}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={(e) => handleButtonClick(e, () => setShowShareModal(true))}
              className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-xs">Share</span>
            </button>

            {/* Report Button */}
            <button
              onClick={(e) => handleButtonClick(e, () => setShowReportModal(true))}
              className="text-gray-500 hover:text-red-400 transition-colors"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>

          {/* Boost Button - Now Blue */}
          <button
            onClick={(e) => handleButtonClick(e, () => setShowBoostModal(true))}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg font-medium text-xs flex items-center space-x-1 transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>Boost</span>
          </button>
        </div>

        {/* Swipe Mode Actions - Skip and Like buttons side by side */}
        {viewMode === "swipe" && (
          <div className="flex space-x-3 mt-3">
            <button
              onClick={(e) => handleButtonClick(e, () => onSwipeLeft && onSwipeLeft())}
              className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center text-sm"
            >
              <X className="w-4 h-4 mr-2" />
              Skip
            </button>
            <button
              onClick={(e) =>
                handleButtonClick(e, () => {
                  handleProjectLike()
                  onSwipeRight && onSwipeRight()
                })
              }
              className="flex-1 py-2 bg-[#E53E3E] hover:bg-[#C53030] text-white font-medium rounded-lg transition-colors flex items-center justify-center text-sm"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Like
            </button>
          </div>
        )}

        {/* Category Mode Actions */}
        {viewMode === "category" && onDonate && (
          <button
            onClick={(e) =>
              handleButtonClick(e, () => {
                handleProjectLike()
                onDonate()
              })
            }
            className="w-full mt-3 py-2 bg-[#E53E3E] hover:bg-[#C53030] text-white font-medium rounded-lg transition-colors text-sm"
          >
            Like
          </button>
        )}
      </div>

      {/* Modals */}
      <BoostModal
        isOpen={showBoostModal}
        onClose={() => setShowBoostModal(false)}
        projectName={project.name}
        onBoost={handleBoost}
      />

      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        projectName={project.name}
        onComment={handleComment}
      />

      {showShareModal && (
        <ShareModal project={project} isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
      )}

      {showReportModal && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          projectName={project.name}
          onSubmit={handleReport}
        />
      )}
    </div>
  )

  if (viewMode === "category") {
    return <div className="flex-shrink-0 w-80">{cardContent}</div>
  }

  return cardContent
}
