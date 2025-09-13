"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Menu, Search, User, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { isLoggedIn, user, logout: contextLogout } = useAuth()

  const handleLogout = async () => {
    await contextLogout()
    // 리다이렉트는 LogoutRedirectHandler에서 자동 처리됨
  }

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-coral-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">TravelMate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/trips" className="text-neutral-600 hover:text-primary-600 transition-colors">
              내 여행
            </Link>
            <Link href="/explore" className="text-neutral-600 hover:text-primary-600 transition-colors">
              둘러보기
            </Link>
            <Link href="/profile" className="text-neutral-600 hover:text-primary-600 transition-colors">
              마이페이지
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Bell className="w-4 h-4" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                      <User className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-gray-500">{user?.email}</div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">마이페이지</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/edit">설정</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">로그인</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">회원가입</Link>
                </Button>
              </div>
            )}

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
                  <Link href="/trips" className="text-neutral-600 hover:text-primary-600 transition-colors">
                    내 여행
                  </Link>
                  <Link href="/explore" className="text-neutral-600 hover:text-primary-600 transition-colors">
                    둘러보기
                  </Link>
                  <Link href="/profile" className="text-neutral-600 hover:text-primary-600 transition-colors">
                    마이페이지
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600 hover:text-red-700 transition-colors"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-neutral-600 hover:text-primary-600 transition-colors">
                    로그인
                  </Link>
                  <Link href="/signup" className="text-neutral-600 hover:text-primary-600 transition-colors">
                    회원가입
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
