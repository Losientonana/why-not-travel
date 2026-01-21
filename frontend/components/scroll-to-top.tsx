"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    try {
      // Attempt to scroll to the top of the page
      window.scrollTo(0, 0)
    } catch (error) {
      // Fallback for environments where window is not defined (e.g., SSR)
      console.error("Failed to scroll to top:", error)
    }
  }, [pathname]) // Re-run effect when pathname changes

  return null // This component doesn't render anything
}
