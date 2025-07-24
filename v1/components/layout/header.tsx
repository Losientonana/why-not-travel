"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Menu, Search, User, X, LogOut, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isLoggedIn, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    // 추가적으로 홈페이지로 리디렉션 할 수 있습니다.
  }

  const renderUserActions = () => {
    if (isLoggedIn) {
      return (
        <>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Bell className="w-4 h-4" />
          </Button>
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <User className="w-4 h-4 mr-2" />
              {user?.nickname || user?.username}
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </>
      )
    } else {
      return (
        <Link href="/login">
          <Button variant="outline" size="sm">
            <LogIn className="w-4 h-4 mr-2" />
            로그인/회원가입
          </Button>
        </Link>
      )
    }
  }

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">TravelMate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-neutral-600 hover:text-blue-600 transition-colors">
              내 여행
            </Link>
            <Link href="#" onClick={(e) => e.preventDefault()} className="text-neutral-400 cursor-not-allowed">
              둘러보기
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {renderUserActions()}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            <nav className="flex flex-col space-y-4">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="text-neutral-600 hover:text-blue-600 transition-colors">
                    내 여행
                  </Link>
                  <Link href="/profile" className="text-neutral-600 hover:text-blue-600 transition-colors">
                    마이페이지
                  </Link>
                  <a onClick={handleLogout} className="text-neutral-600 hover:text-blue-600 transition-colors cursor-pointer">
                    로그아웃
                  </a>
                </>
              ) : (
                <Link href="/login" className="text-neutral-600 hover:text-blue-600 transition-colors">
                  로그인
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
