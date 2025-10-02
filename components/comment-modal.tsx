"use client"

import type React from "react"

import { useState } from "react"
import { X, MessageCircle, Send } from "lucide-react"

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  onComment: (comment: string) => void
}

export function CommentModal({ isOpen, onClose, projectName, onComment }: CommentModalProps) {
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (comment.trim() && comment.length <= 100) {
      setIsSubmitting(true)
      try {
        onComment(comment.trim())
        setComment("")
        onClose()
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const remainingChars = 100 - comment.length
  const isOverLimit = remainingChars < 0
  const isEmpty = comment.trim().length === 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Add Comment</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 text-sm mb-2">Commenting on:</p>
          <p className="text-white font-semibold truncate">{projectName}</p>
        </div>

        <div className="mb-6">
          <textarea
            placeholder="Share your thoughts about this project..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`w-full p-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none resize-none h-24 ${
              isOverLimit ? "border-red-400 focus:border-red-400" : "border-gray-600 focus:border-blue-400"
            }`}
            maxLength={120} // Allow a bit over to show the error state
          />

          <div className="flex justify-between items-center mt-2">
            <span
              className={`text-xs ${
                isOverLimit ? "text-red-400" : remainingChars <= 10 ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              {remainingChars} characters remaining
            </span>
            {isOverLimit && <span className="text-xs text-red-400">Comment too long!</span>}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isEmpty || isOverLimit || isSubmitting}
            className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Post Comment</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Comments help creators understand what the community thinks
        </p>
      </div>
    </div>
  )
}
