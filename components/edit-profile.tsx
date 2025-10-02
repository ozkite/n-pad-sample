"use client"

import type React from "react"

import { useState } from "react"
import { X, Camera } from "lucide-react"

interface EditProfileProps {
  isOpen: boolean
  onClose: () => void
  onSave: (profileData: any) => void
  currentProfile: {
    name: string
    image: string
    farcaster?: string
    lens?: string
    zora?: string
    twitter?: string
    nounsHeld: number
    lilNounsHeld: number
    totalSwipes: number
    projectsReported: number
    totalDonated: number
  }
}

export function EditProfile({ isOpen, onClose, onSave, currentProfile }: EditProfileProps) {
  const [formData, setFormData] = useState({
    name: currentProfile.name || "MiniPay User",
    image: currentProfile.image || "/images/lena-profile.jpg",
    farcaster: currentProfile.farcaster || "",
    lens: currentProfile.lens || "",
    zora: currentProfile.zora || "",
    twitter: currentProfile.twitter || "",
    bio: "",
  })

  const [imagePreview, setImagePreview] = useState(formData.image)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1F2732] rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-[#1F2732] p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Edit Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-600"
              />
              <label className="absolute bottom-0 right-0 bg-[#E53E3E] rounded-full p-2 cursor-pointer hover:bg-[#C53030] transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <p className="text-sm text-gray-400 mt-2">Click camera to change photo</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-[#E53E3E] focus:outline-none"
              placeholder="Enter your display name"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-[#E53E3E] focus:outline-none"
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          {/* Social Profiles */}
          <div>
            <h3 className="text-lg font-medium mb-4">Social Profiles</h3>

            {/* Farcaster */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <span className="w-4 h-4 bg-purple-500 rounded mr-2"></span>
                Farcaster
              </label>
              <input
                type="text"
                value={formData.farcaster}
                onChange={(e) => handleInputChange("farcaster", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-[#E53E3E] focus:outline-none"
                placeholder="@username"
              />
            </div>

            {/* Lens */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded mr-2"></span>
                Lens Protocol
              </label>
              <input
                type="text"
                value={formData.lens}
                onChange={(e) => handleInputChange("lens", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-[#E53E3E] focus:outline-none"
                placeholder="username.lens"
              />
            </div>

            {/* Zora */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <span className="w-4 h-4 bg-blue-500 rounded mr-2"></span>
                Zora
              </label>
              <input
                type="text"
                value={formData.zora}
                onChange={(e) => handleInputChange("zora", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-[#E53E3E] focus:outline-none"
                placeholder="zora.co/@username"
              />
            </div>

            {/* Twitter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <span className="w-4 h-4 bg-black rounded mr-2"></span>
                Twitter / X
              </label>
              <input
                type="text"
                value={formData.twitter}
                onChange={(e) => handleInputChange("twitter", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-[#E53E3E] focus:outline-none"
                placeholder="@username"
              />
            </div>
          </div>

          {/* NFT Holdings (Read-only for now) */}
          <div>
            <h3 className="text-lg font-medium mb-4">NFT Holdings</h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">N</span>
                  </div>
                  <span>Nouns</span>
                </div>
                <span className="text-[#E53E3E] font-bold">{currentProfile.nounsHeld}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-pink-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">L</span>
                  </div>
                  <span>Lil Nouns</span>
                </div>
                <span className="text-[#E53E3E] font-bold">{currentProfile.lilNounsHeld}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                NFT holdings are automatically detected from your connected wallet
              </p>
            </div>
          </div>

          {/* User Stats (Read-only) */}
          <div>
            <h3 className="text-lg font-medium mb-4">Your Stats</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-xl font-bold text-[#E53E3E]">{currentProfile.totalSwipes}</p>
                <p className="text-xs text-gray-400">Total Swipes</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-xl font-bold text-[#E53E3E]">{currentProfile.projectsReported}</p>
                <p className="text-xs text-gray-400">Reports Made</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-xl font-bold text-[#E53E3E]">${currentProfile.totalDonated}</p>
                <p className="text-xs text-gray-400">Total Donated</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-[#E53E3E] hover:bg-[#C53030] text-white font-medium rounded-lg transition-colors"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
