"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

interface CreateAlbumDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { albumTitle: string; albumDate: string }) => Promise<void>
}

export function CreateAlbumDialog({ open, onOpenChange, onSubmit }: CreateAlbumDialogProps) {
  const [albumTitle, setAlbumTitle] = useState("")
  const [albumDate, setAlbumDate] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!albumTitle.trim() || !albumDate) return

    setLoading(true)
    try {
      await onSubmit({
        albumTitle: albumTitle.trim(),
        albumDate,
      })
      setAlbumTitle("")
      setAlbumDate("")
      onOpenChange(false)
    } catch (error) {
      console.error("앨범 생성 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50">
        {/* 장식 요소 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-orange-400/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

        <DialogHeader className="p-6 pb-4 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                새 앨범 만들기
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                여행의 소중한 순간을 담을 앨범을 만들어보세요
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 p-6 pt-2">
            <div className="space-y-2">
              <Label htmlFor="albumTitle" className="text-sm font-medium text-gray-700">
                앨범 이름
              </Label>
              <Input
                id="albumTitle"
                placeholder="예: 제주도 첫째날"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="albumDate" className="text-sm font-medium text-gray-700">
                날짜
              </Label>
              <Input
                id="albumDate"
                type="date"
                value={albumDate}
                onChange={(e) => setAlbumDate(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <DialogFooter className="p-6 pt-0 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="border-gray-300 hover:bg-gray-50"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!albumTitle.trim() || !albumDate || loading}
              className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all"
            >
              {loading ? "생성 중..." : "앨범 만들기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
