"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Heart, Trash2, User } from "lucide-react"
import { useState } from "react"

interface Photo {
  id: number
  imageUrl: string
  thumbnailUrl: string
  userId: number
  userName: string
  likesCount?: number
  createdAt?: string
}

interface PhotoDetailDialogProps {
  photo: Photo | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (photoId: number) => void
  canDelete?: boolean
}

export function PhotoDetailDialog({ photo, open, onOpenChange, onDelete, canDelete = false }: PhotoDetailDialogProps) {
  const [liked, setLiked] = useState(false)

  if (!photo) return null

  const handleLike = () => {
    setLiked(!liked)
    // TODO: 백엔드 좋아요 API 연동
  }

  const handleDelete = () => {
    if (onDelete && window.confirm("이 사진을 삭제하시겠습니까?")) {
      onDelete(photo.id)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 bg-black/95 border-0">
        {/* 헤더 */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center space-x-3 text-white">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{photo.userName}</p>
              {photo.createdAt && (
                <p className="text-xs text-gray-300">
                  {new Date(photo.createdAt).toLocaleDateString("ko-KR")}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="h-9 w-9 p-0 text-white hover:bg-white/10"
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            {canDelete && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-9 w-9 p-0 text-white hover:bg-white/10 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 p-0 text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* 이미지 */}
        <div className="relative w-full" style={{ maxHeight: "80vh" }}>
          <img
            src={photo.imageUrl || "/placeholder.svg"}
            alt={photo.userName}
            className="w-full h-full object-contain"
          />
        </div>

        {/* 푸터 */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              {photo.likesCount !== undefined && (
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm">{photo.likesCount + (liked ? 1 : 0)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
