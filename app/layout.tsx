import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Footer from "@/components/layout/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Recipe Generator",
  description: "Generate personalized recipes using AI with ingredients or dish names",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen flex flex-col ${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* This wrapper ensures layout pushes footer to bottom */}
          <div className="flex flex-col min-h-screen">
            {/* Main content fills the space */}
            <main className="flex-1">{children}</main>

            {/* Footer stays at the bottom */}
            <Footer />
          </div>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
