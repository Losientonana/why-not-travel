// 공통 유틸리티 함수
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, locale = "ko-KR") {
  return new Date(date).toLocaleDateString(locale)
}

export function formatCurrency(amount: number) {
  return `₩${amount.toLocaleString()}`
}

export function calculateProgress(current: number, total: number) {
  return Math.round((current / total) * 100)
}

export function getDaysDifference(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
