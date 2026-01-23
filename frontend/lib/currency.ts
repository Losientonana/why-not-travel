import type { CurrencySettings } from "./types"

// 기본 환율 (JPY)
export const DEFAULT_JPY_RATE = 9.3

// 통화 심볼 맵
export const CURRENCY_SYMBOLS: Record<string, string> = {
  KRW: "₩",
  JPY: "¥",
  USD: "$",
  EUR: "€",
  CNY: "¥",
  GBP: "£",
  THB: "฿",
  VND: "₫",
}

// 통화 이름 맵
export const CURRENCY_NAMES: Record<string, string> = {
  KRW: "원",
  JPY: "엔",
  USD: "달러",
  EUR: "유로",
  CNY: "위안",
  GBP: "파운드",
  THB: "바트",
  VND: "동",
}

/**
 * 원화 금액 포맷
 */
export function formatKRW(amount: number): string {
  return `₩${amount.toLocaleString()}`
}

/**
 * 외화 금액 포맷
 */
export function formatForeignCurrency(amount: number, currencyCode: string): string {
  const symbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode
  return `${symbol}${amount.toLocaleString()}`
}

/**
 * 원화 + 외화 이중 표시
 * 예: "₩93,000 (¥10,000)"
 */
export function formatDualCurrency(
  krwAmount: number,
  foreignAmount: number | undefined | null,
  currencyCode: string | undefined | null
): string {
  const krwFormatted = formatKRW(krwAmount)

  if (!foreignAmount || !currencyCode) {
    return krwFormatted
  }

  const foreignFormatted = formatForeignCurrency(foreignAmount, currencyCode)
  return `${krwFormatted} (${foreignFormatted})`
}

/**
 * 외화 → 원화 변환
 */
export function convertToKRW(foreignAmount: number, exchangeRate: number): number {
  return Math.round(foreignAmount * exchangeRate)
}

/**
 * 원화 → 외화 변환
 */
export function convertFromKRW(krwAmount: number, exchangeRate: number): number {
  if (exchangeRate === 0) return 0
  return Math.round(krwAmount / exchangeRate)
}

/**
 * 통화 설정이 활성화되어 있는지 확인
 */
export function hasForeignCurrency(settings: CurrencySettings | null | undefined): boolean {
  return !!(settings?.foreignCurrency && settings?.exchangeRate)
}

/**
 * 통화 코드로 심볼 가져오기
 */
export function getCurrencySymbol(currencyCode: string | null | undefined): string {
  if (!currencyCode) return "₩"
  return CURRENCY_SYMBOLS[currencyCode] || currencyCode
}

/**
 * 통화 코드로 이름 가져오기
 */
export function getCurrencyName(currencyCode: string | null | undefined): string {
  if (!currencyCode) return "원"
  return CURRENCY_NAMES[currencyCode] || currencyCode
}
