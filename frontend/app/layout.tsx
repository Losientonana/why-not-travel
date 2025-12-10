import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import AuthGuard from "@/components/auth/auth-guard"
import { AuthProvider } from "@/contexts/auth-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { LogoutRedirectHandler } from "@/components/auth/logout-redirect-handler"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TravelMate - 함께 만드는 여행 이야기",
  description: "친구들과 함께 여행을 계획하고, 추억을 기록하고, 공유하세요.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <NotificationProvider>
            <LogoutRedirectHandler />
            <AuthGuard>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </AuthGuard>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
