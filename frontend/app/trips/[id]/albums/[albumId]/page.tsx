"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { getPhotosByAlbum, uploadPhotoToAlbum, deletePhoto, getAlbums } from "@/lib/api"
import { ArrowLeft, Camera, Upload, Trash2, Heart, Share2, Download, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PhotoUploadDialog } from "@/components/trip/photo-upload-dialog"
import { PhotoDetailDialog } from "@/components/trip/photo-detail-dialog"

interface Photo {
  id: number
  imageUrl: string
  thumbnailUrl: string
  userId: number
  userName: string
  likesCount?: number
  createdAt?: string
}

interface Album {
  id: number
  albumTitle: string
  albumDate: string
  photoCount: number
  photos: Photo[]
}

export default function AlbumDetailPage({ params }: { params: { id: string; albumId: string } }) {
  const { user } = useAuth()
  const [album, setAlbum] = useState<Album | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [showPhotoDetail, setShowPhotoDetail] = useState(false)

  // 앨범 정보와 사진 목록 로드
  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        setLoading(true)

        // 앨범 목록에서 현재 앨범 정보 가져오기
        const albums = await getAlbums(Number(params.id))
        const currentAlbum = albums.find((a: Album) => a.id === Number(params.albumId))

        if (currentAlbum) {
          setAlbum(currentAlbum)
        }

        // 사진 목록 가져오기
        const photoData = await getPhotosByAlbum(Number(params.id), Number(params.albumId))
        setPhotos(photoData || [])
      } catch (error) {
        console.error("앨범 데이터 로딩 실패:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlbumData()
  }, [params.id, params.albumId])

  // 사진 업로드
  const handlePhotoUpload = async (albumId: number, file: File) => {
    try {
      await uploadPhotoToAlbum(Number(params.id), albumId, file)
      // 사진 목록 새로고침
      const updatedPhotos = await getPhotosByAlbum(Number(params.id), Number(params.albumId))
      setPhotos(updatedPhotos || [])

      // 앨범 정보도 업데이트
      const albums = await getAlbums(Number(params.id))
      const currentAlbum = albums.find((a: Album) => a.id === Number(params.albumId))
      if (currentAlbum) {
        setAlbum(currentAlbum)
      }
    } catch (error) {
      console.error("사진 업로드 실패:", error)
      throw error
    }
  }

  // 사진 삭제
  const handleDeletePhoto = async (photoId: number) => {
    try {
      await deletePhoto(Number(params.id), photoId)
      // 로컬 상태에서 제거
      setPhotos((prev) => prev.filter((p) => p.id !== photoId))

      // 앨범 정보 업데이트
      if (album) {
        setAlbum({
          ...album,
          photoCount: album.photoCount - 1,
        })
      }
    } catch (error) {
      console.error("사진 삭제 실패:", error)
      alert("사진 삭제에 실패했습니다.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-gray-500">앨범을 불러오는 중...</div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">앨범을 찾을 수 없습니다</p>
          <Link href={`/trips/${params.id}`}>
            <Button variant="outline">여행 상세로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/trips/${params.id}?tab=photos`}>
                <Button variant="ghost" size="sm" className="h-9">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  뒤로
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{album.albumTitle}</h1>
                <p className="text-sm text-gray-600">
                  {new Date(album.albumDate).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" · "}
                  사진 {photos.length}장
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowPhotoUpload(true)}
              className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
            >
              <Upload className="w-4 h-4 mr-2" />
              사진 추가
            </Button>
          </div>
        </div>
      </div>

      {/* 사진 그리드 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {photos.length === 0 ? (
          <Card className="p-12 text-center">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">아직 사진이 없습니다</h3>
            <p className="text-sm text-gray-600 mb-6">첫 번째 사진을 추가해보세요</p>
            <Button
              onClick={() => setShowPhotoUpload(true)}
              className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
            >
              <Upload className="w-4 h-4 mr-2" />
              사진 추가
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => {
                  setSelectedPhoto(photo)
                  setShowPhotoDetail(true)
                }}
                className="relative aspect-square cursor-pointer group overflow-hidden bg-gray-100"
              >
                <img
                  src={photo.thumbnailUrl || photo.imageUrl || "/placeholder.svg"}
                  alt={`Photo ${photo.id}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

                {/* 호버 시 정보 표시 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center space-x-3 text-white">
                    {photo.likesCount !== undefined && (
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 fill-white" />
                        <span className="text-sm font-medium">{photo.likesCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 사진 업로드 다이얼로그 */}
      <PhotoUploadDialog
        open={showPhotoUpload}
        onOpenChange={setShowPhotoUpload}
        albumId={Number(params.albumId)}
        albumTitle={album.albumTitle}
        onUpload={handlePhotoUpload}
      />

      {/* 사진 상세 다이얼로그 */}
      <PhotoDetailDialog
        photo={selectedPhoto}
        open={showPhotoDetail}
        onOpenChange={setShowPhotoDetail}
        onDelete={handleDeletePhoto}
        canDelete={selectedPhoto && user?.id === selectedPhoto.userId}
      />
    </div>
  )
}
