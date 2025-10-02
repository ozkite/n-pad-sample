"use client"

import { useState, useEffect } from "react"
import { ToggleMenu } from "@/components/toggle-menu"
import { CategoryMenu } from "@/components/category-menu"
import { ProjectCard } from "@/components/project-card"
import { CategorySection } from "@/components/category-section"
import { Cart } from "@/components/cart"
import { SuccessScreen } from "@/components/success-screen"
import { WalletConnect } from "@/components/wallet-connect"
import {
  AmountSelector,
  type DonationAmount,
  type StableCoin as CryptoCurrency,
  type ConfirmSwipes,
} from "@/components/amount-selector"
import { projects, categories } from "@/lib/data"
import { UserProfile } from "@/components/user-profile"
import { TrendingSection } from "@/components/trending-section"
import { CommunityFunds } from "@/components/community-funds"
import { WeeklyDrop } from "@/components/weekly-drop"
import { BadgeNotification } from "@/components/badge-notification"
import { ProfileQuickView } from "@/components/profile-quick-view"
import { StarryBackground } from "@/components/starry-background"
import { MobileMockup } from "@/components/mobile-mockup"
import { useMobile } from "@/hooks/use-mobile"
import { ProjectRegistrationForm } from "@/components/project-registration-form"
import { EditProfile } from "@/components/edit-profile"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useTheme } from "@/contexts/theme-context"

export default function Home() {
  const { theme } = useTheme()

  const [viewMode, setViewMode] = useState<"swipe" | "list" | "profile" | "trending">("swipe")
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "Crafts")
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [cart, setCart] = useState<Array<{ project: any; amount: number; currency: CryptoCurrency; message?: string }>>(
    [],
  )
  const [showCart, setShowCart] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [donationAmount, setDonationAmount] = useState<DonationAmount | null>(null)
  const [donationCurrency, setDonationCurrency] = useState<CryptoCurrency>("ETH")
  const [confirmSwipes, setConfirmSwipes] = useState<ConfirmSwipes>(5)
  const [showBadgeNotification, setShowBadgeNotification] = useState(false)
  const [currentBadge, setCurrentBadge] = useState("")
  const [swipeCount, setSwipeCount] = useState(0)
  const [showProfileQuickView, setShowProfileQuickView] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [userStats, setUserStats] = useState({
    totalDonations: 0,
    categoriesSupported: new Set<string>(),
    streak: 0,
    lastDonation: null as Date | null,
  })
  const [userProfile, setUserProfile] = useState({
    name: "Nouns User",
    image: "/images/nouns-profile.png",
    farcaster: "",
    lens: "",
    zora: "",
    twitter: "",
    nounsHeld: 2,
    lilNounsHeld: 5,
    totalSwipes: 47,
    projectsReported: 3,
    totalDonated: 125.75,
  })
  const [userBalance, setUserBalance] = useState({
    ETH: 2.5,
    USDT: 125.75,
    DAI: 100.0,
    USDC: 150.25,
  })
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [shownBadges, setShownBadges] = useState<Set<string>>(new Set())
  const [isSwipingInCategory, setIsSwipingInCategory] = useState(false)
  const [categorySwipeTimer, setCategorySwipeTimer] = useState<NodeJS.Timeout | null>(null)

  const recentDonations = cart.slice(0, 5).map((item, index) => ({
    project: item.project,
    amount: item.amount,
    currency: item.currency,
    date: new Date(Date.now() - index * 86400000), // Today, yesterday, etc.
  }))

  const savedProjects = projects.slice(0, 3)

  const filteredProjects = projects.filter((project) => project.category === selectedCategory)

  useEffect(() => {
    let isMounted = true

    const checkStreak = () => {
      if (!isMounted) return 0
      if (userStats.lastDonation) {
        const lastDonationDate = new Date(userStats.lastDonation)
        const today = new Date()
        const diffTime = Math.abs(today.getTime() - lastDonationDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays <= 1) {
          return userStats.streak
        } else {
          return 0
        }
      }
      return 0
    }

    const checkBadges = () => {
      if (!isMounted) return

      if (userStats.totalDonations === 1 && !shownBadges.has("First Swipe")) {
        setCurrentBadge("First Swipe")
        setShowBadgeNotification(true)
        setShownBadges((prev) => new Set([...prev, "First Swipe"]))
      } else if (checkStreak() === 5 && !shownBadges.has("5-Day Streak")) {
        setCurrentBadge("5-Day Streak")
        setShowBadgeNotification(true)
        setShownBadges((prev) => new Set([...prev, "5-Day Streak"]))
      } else if (userStats.categoriesSupported.size >= 3 && !shownBadges.has("Category Champion")) {
        setCurrentBadge("Category Champion")
        setShowBadgeNotification(true)
        setShownBadges((prev) => new Set([...prev, "Category Champion"]))
      }
    }

    checkBadges()

    return () => {
      isMounted = false
    }
  }, [userStats, shownBadges])

  const handleSwipeRight = () => {
    if (donationAmount === null) return

    setIsSwipingInCategory(true)

    if (categorySwipeTimer) {
      clearTimeout(categorySwipeTimer)
    }

    const newTimer = setTimeout(() => {
      setIsSwipingInCategory(false)
    }, 3000) // Clear swiping state after 3 seconds of inactivity

    setCategorySwipeTimer(newTimer)

    const project = filteredProjects[currentProjectIndex]

    setUserStats((prev) => {
      const categoriesSupported = new Set(prev.categoriesSupported)
      categoriesSupported.add(project.category)

      return {
        totalDonations: prev.totalDonations + 1,
        categoriesSupported,
        streak: prev.lastDonation ? prev.streak + 1 : 1,
        lastDonation: new Date(),
      }
    })

    setUserProfile((prev) => ({
      ...prev,
      totalSwipes: prev.totalSwipes + 1,
      totalDonated: prev.totalDonated + Number.parseFloat(donationAmount.split(" ")[0]),
    }))

    const newCart = [...cart, { project, amount: donationAmount, currency: donationCurrency }]
    setCart(newCart)

    const newSwipeCount = swipeCount + 1
    setSwipeCount(newSwipeCount)

    if (newSwipeCount >= confirmSwipes) {
      setShowSuccess(true)
      setSwipeCount(0)
    }

    if (currentProjectIndex < filteredProjects.length - 1) {
      setCurrentProjectIndex(currentProjectIndex + 1)
    } else {
      setCurrentProjectIndex(0)
    }
  }

  const handleSwipeLeft = () => {
    setIsSwipingInCategory(true)

    if (categorySwipeTimer) {
      clearTimeout(categorySwipeTimer)
    }

    const newTimer = setTimeout(() => {
      setIsSwipingInCategory(false)
    }, 3000) // Clear swiping state after 3 seconds of inactivity

    setCategorySwipeTimer(newTimer)

    setUserProfile((prev) => ({
      ...prev,
      totalSwipes: prev.totalSwipes + 1,
    }))

    if (currentProjectIndex < filteredProjects.length - 1) {
      setCurrentProjectIndex(currentProjectIndex + 1)
    } else {
      setCurrentProjectIndex(0)
    }
  }

  const handleAmountSelect = (amount: DonationAmount, currency: CryptoCurrency, swipes: ConfirmSwipes) => {
    setDonationAmount(amount)
    setDonationCurrency(currency)
    setConfirmSwipes(swipes)
    setSwipeCount(0) // Reset swipe count when starting new session
  }

  const handleCheckout = async () => {
    setShowCart(false)
    setShowSuccess(true)

    const uniqueCategories = new Set<string>()
    cart.forEach((item) => uniqueCategories.add(item.project.category))

    setUserStats((prev) => ({
      totalDonations: prev.totalDonations + cart.length,
      categoriesSupported: new Set([...prev.categoriesSupported, ...uniqueCategories]),
      streak: prev.lastDonation ? prev.streak + 1 : 1,
      lastDonation: new Date(),
    }))

    setCart([])
    setSwipeCount(0)
  }

  const handleCategoryProjectDonate = (project: any, amount = 5) => {
    setUserStats((prev) => {
      const categoriesSupported = new Set(prev.categoriesSupported)
      categoriesSupported.add(project.category)

      return {
        totalDonations: prev.totalDonations + 1,
        categoriesSupported,
        streak: prev.lastDonation ? prev.streak + 1 : 1,
        lastDonation: new Date(),
      }
    })

    setCart([...cart, { project, amount, currency: "ETH" }])
    setShowSuccess(true)
  }

  const handleProjectBoost = (project: any, amount: number) => {
    console.log(`Boosting ${project.name} with $${amount}`)
    alert(`Successfully boosted ${project.name} with $${amount}!`)
  }

  const handleRegisterProject = () => {
    setShowRegistrationForm(true)
  }

  const handleRegistrationSubmit = (formData: any) => {
    console.log("Project registration submitted:", formData)
    alert("Thank you! Your project registration has been submitted for review.")
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    // Continue with current settings, don't reset donation amount
  }

  const handleProfileSave = (profileData: any) => {
    setUserProfile((prev) => ({
      ...prev,
      ...profileData,
    }))
  }

  const projectsByCategory = categories.reduce(
    (acc, category) => {
      const categoryProjects = projects.filter((project) => project.category === category)
      if (categoryProjects.length > 0) {
        acc[category] = categoryProjects
      }
      return acc
    },
    {} as Record<string, typeof projects>,
  )

  useEffect(() => {
    return () => {
      if (categorySwipeTimer) {
        clearTimeout(categorySwipeTimer)
      }
    }
  }, [categorySwipeTimer])

  const AppContent = () => (
    <div className={`w-full h-full flex flex-col overflow-hidden ${theme === "nounish" ? "app-container" : ""}`}>
      <ThemeSwitcher />

      {!walletConnected ? (
        <WalletConnect onConnect={() => setWalletConnected(true)} />
      ) : (
        <>
          {/* Fixed Header */}
          <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
            <div className="flex flex-col items-center py-2">
              <div className="flex items-center justify-between w-full mb-2 px-6">
                <div className="w-8"></div>
                <div className="flex-1 flex flex-col items-center">
                  <h1
                    className="text-lg font-bold text-center text-white nouns-pad-font"
                    style={{ fontFamily: "Pixelify Sans, monospace" }}
                  >
                    NOUNS PAD
                  </h1>
                </div>
                <button
                  onClick={handleRegisterProject}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#677FEB] text-white hover:bg-[#5A6FD3] transition-colors"
                  title="Register Project"
                >
                  <RegisterIcon />
                </button>
              </div>

              {walletConnected && donationAmount && (
                <div className="bg-transparent rounded-full px-4 py-1 mb-2 flex items-center">
                  <span className="text-[#E53E3E] font-bold text-base mr-1">{userBalance[donationCurrency]}</span>
                  <span className="text-gray-400 text-sm mr-1">{donationCurrency}</span>
                  <button className="text-gray-400 hover:text-white">
                    <ChevronDownIcon />
                  </button>
                </div>
              )}

              {walletConnected && donationAmount && (
                <div className="px-6 mb-2">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-1">{selectedCategory}</h2>
                    <p className="text-sm text-gray-400">Swipe through {selectedCategory.toLowerCase()} projects</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between w-full px-6 space-x-2">
                <button
                  className="flex items-center justify-center w-12 h-12 rounded-full relative"
                  onClick={() => setShowEditProfile(true)}
                >
                  <img
                    src={userProfile.image || "/images/nouns-profile.png"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </button>
                <button
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700"
                  onClick={() => setViewMode("trending")}
                >
                  <TrendingIcon />
                </button>
                <button
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#677FEB] relative"
                  onClick={() => setShowCart(true)}
                >
                  <CartIcon />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#E53E3E] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {viewMode === "profile" ? (
              <UserProfile stats={userStats} onBack={() => setViewMode("swipe")} />
            ) : viewMode === "trending" ? (
              <div className="px-6 py-3">
                <TrendingSection onDonate={handleCategoryProjectDonate} />
                <CommunityFunds onDonate={handleCategoryProjectDonate} />
                <WeeklyDrop onDonate={handleCategoryProjectDonate} />
                <button
                  onClick={() => setViewMode("swipe")}
                  className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors mt-6"
                >
                  Back to Swipe
                </button>
              </div>
            ) : (
              <div className="py-3">
                <ToggleMenu
                  viewMode={viewMode === "swipe" ? "swipe" : "list"}
                  setViewMode={(mode) => setViewMode(mode)}
                />

                {viewMode === "swipe" ? (
                  <>
                    {donationAmount === null ? (
                      <AmountSelector onSelect={handleAmountSelect} />
                    ) : (
                      <>
                        <CategoryMenu
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                          setCurrentProjectIndex={() => setCurrentProjectIndex(0)}
                          isSwipingInCategory={isSwipingInCategory}
                        />

                        <div className="mb-1 px-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-sm text-gray-300">Donating: </span>
                              <span className="font-bold text-[#E53E3E]">
                                {donationAmount} {donationCurrency}
                              </span>
                            </div>
                            <button
                              onClick={() => setDonationAmount(null)}
                              className="text-sm text-gray-300 hover:text-white underline"
                            >
                              Change
                            </button>
                          </div>
                          <div className="mt-1 bg-gray-800 rounded-lg p-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Swipes until confirmation:</span>
                              <span>{confirmSwipes - swipeCount} more</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-[#E53E3E] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(swipeCount / confirmSwipes) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="px-6">
                          {filteredProjects.length > 0 && (
                            <ProjectCard
                              project={filteredProjects[currentProjectIndex]}
                              onSwipeLeft={handleSwipeLeft}
                              onSwipeRight={handleSwipeRight}
                              viewMode="swipe"
                              donationAmount={donationAmount}
                              donationCurrency={donationCurrency}
                              onBoost={(amount) => handleProjectBoost(filteredProjects[currentProjectIndex], amount)}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="mt-3">
                    {Object.entries(projectsByCategory).map(([category, categoryProjects]) => (
                      <CategorySection
                        key={category}
                        category={category}
                        projects={categoryProjects}
                        onDonate={handleCategoryProjectDonate}
                        onBoost={handleProjectBoost}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {showCart && <Cart items={cart} onClose={() => setShowCart(false)} onCheckout={handleCheckout} />}

      {showSuccess && (
        <SuccessScreen
          onClose={handleSuccessClose}
          categories={[...new Set(cart.map((item) => item.project.category))]}
        />
      )}

      {showBadgeNotification && (
        <BadgeNotification badge={currentBadge} onClose={() => setShowBadgeNotification(false)} />
      )}

      <ProfileQuickView
        isOpen={showProfileQuickView}
        onClose={() => setShowProfileQuickView(false)}
        userStats={userStats}
        recentDonations={recentDonations}
        savedProjects={savedProjects}
      />

      <EditProfile
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleProfileSave}
        currentProfile={userProfile}
      />

      <ProjectRegistrationForm
        isOpen={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
        onSubmit={handleRegistrationSubmit}
      />
    </div>
  )

  return (
    <main className="flex min-h-screen flex-col items-center text-white relative overflow-hidden">
      <StarryBackground />

      {useMobile() ? (
        <div className="relative z-10 w-full h-screen">
          <AppContent />
        </div>
      ) : (
        <MobileMockup>
          <AppContent />
        </MobileMockup>
      )}
    </main>
  )
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

function TrendingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

function RegisterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
