'use client'

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from '../../contexts/AuthContext'
import PrivateRoute from '../../components/PrivateRoute'
import { ArrowLeft, Camera, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function ProfilePageContent() {
  const { user, logout } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    phone: "",
    location: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: "", // API에 bio 필드가 없으므로 초기값 설정
        phone: "", // API에 phone 필드가 없으므로 초기값 설정
        location: "", // API에 location 필드가 없으므로 초기값 설정
      });
    }
  }, [user]);

  // ... (이하 기존의 모든 UI 및 핸들러 로직은 여기에 그대로 유지됩니다) ...
  const [notificationSettings, setNotificationSettings] = useState({
    tripInvites: true,
    comments: true,
    likes: false,
    newFollowers: true,
    emailNotifications: true,
    pushNotifications: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public", // public, friends, private
    tripVisibility: "friends",
    showEmail: false,
    showPhone: false,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 프로필 업데이트 로직 구현
    console.log("프로필 업데이트:", formData)
    alert("프로필이 저장되었습니다! (데모)")
  }

  const handleSaveNotifications = () => {
    console.log("Saving notifications:", notificationSettings)
    alert("알림 설정이 저장되었습니다!")
  }

  const handleSavePrivacy = () => {
    console.log("Saving privacy:", privacySettings)
    alert("개인정보 설정이 저장되었습니다!")
  }

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.")
      return
    }
    console.log("Changing password")
    alert("비밀번호가 변경되었습니다!")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>홈으로</span>
            </Link>
            <Button onClick={logout} variant="destructive">로그아웃</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile">기본 정보</TabsTrigger>
            <TabsTrigger value="notifications">알림 설정</TabsTrigger>
            <TabsTrigger value="privacy">개인정보</TabsTrigger>
            <TabsTrigger value="security">보안</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>개인 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage
                          src={avatarPreview || `https://i.pravatar.cc/150?u=${formData.email}`}
                          alt={formData.name}
                        />
                        <AvatarFallback className="text-2xl">{formData.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-transparent"
                        variant="outline"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button type="button" variant="outline" size="sm">
                      프로필 사진 변경
                    </Button>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      이름 *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      이메일 *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      readOnly // 이메일은 보통 변경하지 않음
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      전화번호
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      위치
                    </label>
                    <Input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      자기소개
                    </label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      placeholder="자신에 대해 간단히 소개해주세요..."
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                      <Link href="/">취소</Link>
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      저장하기
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Other Tabs Content... */}
          <TabsContent value="notifications">...</TabsContent>
          <TabsContent value="privacy">...</TabsContent>
          <TabsContent value="security">...</TabsContent>

        </Tabs>
      </main>
    </div>
  )
}

export default function ProfilePage() {
    return (
        <PrivateRoute>
            <ProfilePageContent />
        </PrivateRoute>
    )
}