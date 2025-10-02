"use client"

import { useState } from "react"
import { useTheme } from "@/contexts/theme-context"

export type DonationAmount = "1" | "10" | "50" | "custom"
export type CryptoCurrency = "ETH" | "USDT" | "DAI" | "USDC"
export type ConfirmSwipes = 5 | 10 | 20

interface AmountSelectorProps {
  onSelect: (amount: DonationAmount, currency: CryptoCurrency, swipes: ConfirmSwipes) => void
}

const conversionRates = {
  ETH: 0.0003,
  USDT: 1.0,
  DAI: 1.0,
  USDC: 1.0,
}

export function AmountSelector({ onSelect }: AmountSelectorProps) {
  const { theme } = useTheme()
  const [selectedAmount, setSelectedAmount] = useState<DonationAmount>("1")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>("ETH")
  const [selectedSwipes, setSelectedSwipes] = useState<ConfirmSwipes>(5)

  const amounts: DonationAmount[] = ["1", "10", "50", "custom"]
  const currencies: CryptoCurrency[] = ["ETH", "USDT", "DAI", "USDC"]
  const swipeOptions: ConfirmSwipes[] = [5, 10, 20]

  const handleConfirm = () => {
    onSelect(selectedAmount, selectedCurrency, selectedSwipes)
  }

  const getConvertedAmount = (cents: string, currency: CryptoCurrency) => {
    let amount: number
    if (cents === "custom") {
      amount = customAmount ? Number.parseFloat(customAmount) / 100 : 0
    } else {
      amount = Number.parseFloat(cents) / 100
    }
    const converted = amount * conversionRates[currency]
    return currency === "ETH" ? converted.toFixed(6) : converted.toFixed(2)
  }

  const getButtonClass = (isSelected: boolean) => {
    if (theme === "nounish") {
      return isSelected ? "pixel-button pixel-button-primary" : "pixel-button pixel-button-secondary"
    }
    return `py-2 px-2 rounded-lg font-medium text-sm transition-colors ${
      isSelected ? "bg-[#E53E3E] text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
    }`
  }

  const getLargeButtonClass = (isSelected: boolean) => {
    if (theme === "nounish") {
      return isSelected ? "pixel-button pixel-button-primary" : "pixel-button pixel-button-secondary"
    }
    return `py-3 px-4 rounded-lg font-medium transition-colors ${
      isSelected ? "bg-[#E53E3E] text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
    }`
  }

  const getInputClass = (isSelected: boolean) => {
    if (theme === "nounish") {
      return `w-full py-2 px-2 pixel-input ${isSelected ? "bg-[#E53E3E] text-white" : ""}`
    }
    return `w-full py-2 px-2 rounded-lg font-medium text-sm transition-colors ${
      isSelected
        ? "bg-[#E53E3E] text-white placeholder:text-white/70"
        : "bg-gray-700 text-gray-300 placeholder:text-gray-500"
    }`
  }

  const titleClass = theme === "nounish" ? "text-xl font-bold mb-6" : "text-xl font-bold mb-6 text-white"
  const subtitleClass = theme === "nounish" ? "text-sm font-medium mb-3" : "text-base font-medium mb-3 text-gray-300"

  return (
    <div className="px-6">
      <h2 className={titleClass}>Select Donation Amount</h2>

      {/* Amount Selection */}
      <div className="mb-6">
        <h3 className={subtitleClass}>Amount to swipe:</h3>
        <div className="grid grid-cols-4 gap-2">
          {amounts.map((amount) =>
            amount === "custom" ? (
              <div key={amount} className="relative">
                <input
                  type="number"
                  placeholder="custom"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount("custom")
                  }}
                  onFocus={() => setSelectedAmount("custom")}
                  className={getInputClass(selectedAmount === "custom")}
                />
              </div>
            ) : (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={getButtonClass(selectedAmount === amount)}
              >
                {amount} ¢
              </button>
            ),
          )}
        </div>
      </div>

      {/* Crypto Selection */}
      <div className="mb-6">
        <h3 className={subtitleClass}>Choose Crypto:</h3>
        <div className="grid grid-cols-2 gap-3">
          {currencies.map((currency) => (
            <button
              key={currency}
              onClick={() => setSelectedCurrency(currency)}
              className={getLargeButtonClass(selectedCurrency === currency)}
            >
              <div className="text-center">
                <div className="font-bold">{currency}</div>
                <div className={`text-xs opacity-75 ${theme === "nounish" ? "mt-1" : ""}`}>
                  {getConvertedAmount(selectedAmount, currency)} {currency}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Confirm Swipes Selection */}
      <div className="mb-8">
        <h3 className={subtitleClass}>Confirm swipes:</h3>
        <div className="grid grid-cols-3 gap-3">
          {swipeOptions.map((swipes) => (
            <button
              key={swipes}
              onClick={() => setSelectedSwipes(swipes)}
              className={getLargeButtonClass(selectedSwipes === swipes)}
            >
              {swipes}
            </button>
          ))}
        </div>
      </div>

      {/* Start Swiping Button */}
      <button
        onClick={handleConfirm}
        className={
          theme === "nounish"
            ? "w-full py-4 pixel-button pixel-button-primary font-bold"
            : "w-full py-4 bg-[#E53E3E] hover:bg-[#C53030] text-white font-bold rounded-lg transition-colors"
        }
      >
        Start Swiping
      </button>
    </div>
  )
}
