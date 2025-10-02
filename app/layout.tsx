import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AnimatedBackground } from "@/components/animated-background"
import { ThemeProvider } from "@/contexts/theme-context"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Nouns Pad",
  description: "Discover and support amazing projects",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <ThemeProvider>
          <Suspense fallback={null}>
            <AnimatedBackground />
            <div className="relative z-10">{children}</div>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
