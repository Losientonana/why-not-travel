"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Camera, MoreHorizontal, Trash2, Upload } from "lucide-react"

interface Photo {
  id: number
  imageUrl: string
  thumbnailUrl: string
  userId: number
  userName: string
  likesCount?: number
}

interface AlbumCardProps {
  tripId: number
  album: {
    id: number
    albumTitle: string
    albumDate: string
    photoCount: number
    photos: Photo[]
  }
  onUploadClick: (e: React.MouseEvent) => void
  onDeleteAlbum: (e: React.MouseEvent) => void
}

export function AlbumCard({ tripId, album, onUploadClick, onDeleteAlbum }: AlbumCardProps) {
  // 대표 사진 (가장 먼저 저장한 사진)
  const coverPhoto = album.photos[0]

  return (
    <Link href={`/trips/${tripId}/albums/${album.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <CardContent className="p-0">
          {/* 앨범 헤더 */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-orange-50">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 truncate">{album.albumTitle}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {new Date(album.albumDate).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onUploadClick}>
                    <Upload className="w-4 h-4 mr-2" />
                    사진 추가
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDeleteAlbum} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    앨범 삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Camera className="w-3 h-3 mr-1" />
              사진 {album.photoCount}장
            </div>
          </div>

          {/* 대표 사진 */}
          {coverPhoto ? (
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <img
                src={coverPhoto.thumbnailUrl || coverPhoto.imageUrl || "/placeholder.svg"}
                alt={album.albumTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              {album.photoCount > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                  <Camera className="w-3 h-3" />
                  <span>{album.photoCount}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
              <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 mb-3">아직 사진이 없습니다</p>
              <Button
                size="sm"
                onClick={onUploadClick}
                className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
              >
                <Upload className="w-3 h-3 mr-1" />
                사진 추가
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
