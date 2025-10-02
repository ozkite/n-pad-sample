"use client"

import { useState } from "react"

interface WalletConnectProps {
  onConnect: () => void
}

const TrendingIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const CartIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9H19M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2 2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
)

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)

    // Demo connection simulation
    setTimeout(() => {
      setIsConnecting(false)
      onConnect()
    }, 1500)
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between w-full mb-12 px-2">
        <button className="flex items-center justify-center w-12 h-12 rounded-full relative">
          <img
            src="/images/nouns-profile.png"
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
          />
        </button>

        <div className="flex-1"></div>

        <div className="flex space-x-3">
          <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <TrendingIcon />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#677FEB] hover:bg-[#5A6FD3] transition-colors">
            <CartIcon />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-32 h-32 flex items-center justify-center mb-8">
          <img
            src="/images/red-nouns-glasses.png"
            alt="Nouns Glasses"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>

        <h1 className="text-4xl font-bold text-white mb-3 nouns-pad-font tracking-wider">NOUNS PAD</h1>

        <p className="text-gray-300 text-lg mb-12 max-w-sm leading-relaxed">
          Enter NounsPad on Ethereum and start supporting amazing projects
        </p>
      </div>

      {/* Connect Button */}
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="w-full max-w-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl text-lg"
      >
        {isConnecting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            Connecting...
          </div>
        ) : (
          "Connect Wallet"
        )}
      </button>

      <p className="text-gray-400 text-sm mt-8 text-center max-w-sm leading-relaxed">
        By connecting, you agree to our Terms of Service and Privacy Policy
      </p>

      <div className="absolute top-20 left-10 w-2 h-2 bg-red-500 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-32 right-16 w-1 h-1 bg-blue-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-red-400 rounded-full opacity-50 animate-pulse delay-500"></div>
    </div>
  )
}
