"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { isLoggedIn, user, logout: contextLogout } = useAuth()

    const handleLogout = async () => {
        await contextLogout()
    }

    return (
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-coral-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <span className="text-xl font-bold text-neutral-900 hidden sm:block">
                            TravelMate
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/trips" className="text-neutral-600 hover:text-primary-600">내 여행</Link>
                        <Link href="/trip/create" className="text-neutral-600 hover:text-primary-600">여행 만들기</Link>
                        <Link href="/explore" className="text-neutral-600 hover:text-primary-600">둘러보기</Link>
                        <Link href="/profile" className="text-neutral-600 hover:text-primary-600">마이페이지</Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0 flex-nowrap">

                        {isLoggedIn ? (
                            <>
                                {/* 🔍 검색 */}
                                <Button variant="ghost" size="icon">
                                    <Search className="w-5 h-5" />
                                </Button>

                                {/* 🔔 알림 */}
                                <NotificationDropdown />

                                {/* 👤 유저 */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <User className="w-5 h-5" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        {/* 데스크탑에서만 유저 정보 노출 */}
                                        <div className="hidden md:block px-2 py-1.5 text-sm">
                                            <div className="font-medium">{user?.name}</div>
                                            <div className="text-gray-500">{user?.email}</div>
                                        </div>

                                        <DropdownMenuSeparator className="hidden md:block" />

                                        <DropdownMenuItem asChild>
                                            <Link href="/profile">마이페이지</Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="text-red-600"
                                        >
                                            로그아웃
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                {/* 비로그인 상태: 데스크탑만 버튼 노출 */}
                                <div className="hidden md:flex gap-2">
                                    <Button variant="ghost" asChild>
                                        <Link href="/login">로그인</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/signup">회원가입</Link>
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* ☰ 햄버거 메뉴 (모바일 전용) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-neutral-200">
                        <nav className="flex flex-col space-y-4">
                            {isLoggedIn ? (
                                <>
                                    <Link href="/trips">내 여행</Link>
                                    <Link href="/trip/create">여행 만들기</Link>
                                    <Link href="/explore">둘러보기</Link>
                                    <Link href="/profile">마이페이지</Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">로그인</Link>
                                    <Link href="/signup">회원가입</Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
