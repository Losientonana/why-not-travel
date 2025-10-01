"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function PublicRoute({ children, redirectTo = "/dashboard" }: PublicRouteProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const authed = isAuthenticated()
      setIsAuthed(authed)
      setIsLoading(false)

      if (authed) {
        router.push(redirectTo)
      }
    }

    checkAuth()
  }, [router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (isAuthed) {
    return null
  }

  return <>{children}</>
}