"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import api from "./axios"

interface User {
  id: number
  username: string
  name: string | null
  email: string
  nickname: string | null
  role: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    const token = localStorage.getItem("access")
    if (token) {
      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`
        const response = await api.get<User>("/api/user/me")
        setUser(response.data)
        setIsLoggedIn(true)
      } catch (error) {
        console.error("Failed to fetch user", error)
        localStorage.removeItem("access")
        setUser(null)
        setIsLoggedIn(false)
      }
    } else {
      setUser(null)
      setIsLoggedIn(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const login = async (token: string) => {
    localStorage.setItem("access", token)
    await fetchUser()
  }

  const logout = () => {
    // TODO: /api/logout 호출 추가
    localStorage.removeItem("access")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
