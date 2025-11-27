"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react"

interface PhotoUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  albumId: number
  albumTitle: string
  onUpload: (albumId: number, file: File) => Promise<void>
}

interface FileWithPreview {
  file: File
  previewUrl: string
}

export function PhotoUploadDialog({ open, onOpenChange, albumId, albumTitle, onUpload }: PhotoUploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const validFiles: FileWithPreview[] = []

    files.forEach((file) => {
      // 이미지 파일 유효성 검사
      if (!file.type.startsWith("image/")) {
        alert(`${file.name}은(는) 이미지 파일이 아닙니다.`)
        return
      }

      // 파일 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name}의 크기가 10MB를 초과합니다.`)
        return
      }

      // 미리보기 생성
      const reader = new FileReader()
      reader.onloadend = () => {
        validFiles.push({
          file,
          previewUrl: reader.result as string,
        })

        // 모든 파일 처리 완료 시 상태 업데이트
        if (validFiles.length === files.filter((f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024).length) {
          setSelectedFiles((prev) => [...prev, ...validFiles])
        }
      }
      reader.readAsDataURL(file)
    })

    // input 초기화 (같은 파일 다시 선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveAllFiles = () => {
    setSelectedFiles([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setLoading(true)
    setUploadProgress({ current: 0, total: selectedFiles.length })

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const { file } = selectedFiles[i]
        setUploadProgress({ current: i + 1, total: selectedFiles.length })
        await onUpload(albumId, file)
      }

      handleRemoveAllFiles()
      setUploadProgress(null)
      onOpenChange(false)
    } catch (error) {
      console.error("사진 업로드 실패:", error)
      alert("사진 업로드에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
      setUploadProgress(null)
    }
  }

  const handleClose = () => {
    if (!loading) {
      handleRemoveAllFiles()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50">
        {/* 장식 요소 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-orange-400/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

        <DialogHeader className="p-6 pb-4 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 shadow-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                사진 업로드
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                {albumTitle}에 사진을 추가하세요 (다중 선택 가능)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* 파일 선택 영역 */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all"
          >
            <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
            <p className="text-sm text-gray-600 mb-1">
              클릭하여 이미지를 선택하세요 (여러 장 선택 가능)
            </p>
            <p className="text-xs text-gray-500">JPG, PNG, GIF, BMP (최대 10MB)</p>
          </div>

          {/* 선택된 파일 미리보기 */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  선택된 사진 ({selectedFiles.length}장)
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveAllFiles}
                  disabled={loading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  전체 삭제
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {selectedFiles.map((fileWithPreview, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={fileWithPreview.previewUrl}
                        alt={fileWithPreview.file.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <p className="text-xs text-gray-600 truncate mt-1">{fileWithPreview.file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 업로드 진행 상황 */}
          {uploadProgress && (
            <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between text-sm text-blue-900">
                <span className="font-medium">업로드 중...</span>
                <span>
                  {uploadProgress.current} / {uploadProgress.total}
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <DialogFooter className="p-6 pt-0 gap-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading} className="border-gray-300 hover:bg-gray-50">
            취소
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || loading}
            className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all"
          >
            {loading
              ? `업로드 중 (${uploadProgress?.current || 0}/${uploadProgress?.total || 0})...`
              : `사진 업로드 (${selectedFiles.length}장)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
