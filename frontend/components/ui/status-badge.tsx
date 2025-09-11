// 재사용 가능한 상태 배지 컴포넌트
import { Badge } from "@/components/ui/badge"
import { STATUS_CONFIG } from "@/lib/constants"

interface StatusBadgeProps {
  status: keyof typeof STATUS_CONFIG
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return <Badge className={`${config.color} ${className}`}>{config.label}</Badge>
}
