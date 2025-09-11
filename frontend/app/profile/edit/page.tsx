"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Camera, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserInfo } from "@/lib/auth";

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    phone: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await getUserInfo();
      if (userInfo) {
        setFormData({
          name: userInfo.name || "",
          email: userInfo.email || "",
          bio: "", // bio, phone, location은 API에 없으므로 빈 값으로 초기화
          phone: "",
          location: "",
        });
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

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
  }

  const handleSaveNotifications = () => {
    // Handle notification settings save
    console.log("Saving notifications:", notificationSettings)
    alert("알림 설정이 저장되었습니다!")
  }

  const handleSavePrivacy = () => {
    // Handle privacy settings save
    console.log("Saving privacy:", privacySettings)
    alert("개인정보 설정이 저장되었습니다!")
  }

  const handleChangePassword = () => {
    // Handle password change
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.")
      return
    }
    console.log("Changing password")
    alert("비밀번호가 변경되었습니다!")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>프로필로 돌아가기</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TravelMate</span>
            </Link>
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

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>개인 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage
                          src={avatarPreview || `/placeholder.svg?height=100&width=100&text=${formData.name[0]}`}
                          alt={formData.name}
                        />
                        <AvatarFallback className="text-2xl">{formData.name[0]}</AvatarFallback>
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

                  {/* Name */}
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

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      이메일 *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  {/* Phone */}
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

                  {/* Location */}
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

                  {/* Bio */}
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

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                      <Link href="/profile">취소</Link>
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

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  알림 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">여행 초대</p>
                      <p className="text-sm text-gray-600">새로운 여행에 초대받았을 때</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          tripInvites: !notificationSettings.tripInvites,
                        })
                      }
                    >
                      {notificationSettings.tripInvites ? "켜짐" : "꺼짐"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">댓글 알림</p>
                      <p className="text-sm text-gray-600">내 게시물에 댓글이 달렸을 때</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNotificationSettings({ ...notificationSettings, comments: !notificationSettings.comments })
                      }
                    >
                      {notificationSettings.comments ? "켜짐" : "꺼짐"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">좋아요 알림</p>
                      <p className="text-sm text-gray-600">내 게시물에 좋아요를 받았을 때</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNotificationSettings({ ...notificationSettings, likes: !notificationSettings.likes })
                      }
                    >
                      {notificationSettings.likes ? "켜짐" : "꺼짐"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">새 팔로워</p>
                      <p className="text-sm text-gray-600">새로운 팔로워가 생겼을 때</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          newFollowers: !notificationSettings.newFollowers,
                        })
                      }
                    >
                      {notificationSettings.newFollowers ? "켜짐" : "꺼짐"}
                    </Button>
                  </div>
                </div>

                <hr />

                <div className="space-y-4">
                  <h3 className="font-medium">알림 방식</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">이메일 알림</p>
                      <p className="text-sm text-gray-600">이메일로 알림을 받습니다</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: !notificationSettings.emailNotifications,
                        })
                      }
                    >
                      {notificationSettings.emailNotifications ? "켜짐" : "꺼짐"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">푸시 알림</p>
                      <p className="text-sm text-gray-600">브라우저 푸시 알림을 받습니다</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          pushNotifications: !notificationSettings.pushNotifications,
                        })
                      }
                    >
                      {notificationSettings.pushNotifications ? "켜짐" : "꺼짐"}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications} className="bg-primary-500 hover:bg-primary-600">
                    <Save className="w-4 h-4 mr-2" />
                    저장하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  개인정보 보호
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-base font-medium mb-3 block">프로필 공개 범위</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="public"
                          checked={privacySettings.profileVisibility === "public"}
                          onChange={(e) =>
                            setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })
                          }
                        />
                        <Camera className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium">전체 공개</p>
                          <p className="text-sm text-gray-600">모든 사용자가 내 프로필을 볼 수 있습니다</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="friends"
                          checked={privacySettings.profileVisibility === "friends"}
                          onChange={(e) =>
                            setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })
                          }
                        />
                        <Camera className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium">친구만</p>
                          <p className="text-sm text-gray-600">친구들만 내 프로필을 볼 수 있습니다</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="private"
                          checked={privacySettings.profileVisibility === "private"}
                          onChange={(e) =>
                            setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })
                          }
                        />
                        <Camera className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium">비공개</p>
                          <p className="text-sm text-gray-600">나만 내 프로필을 볼 수 있습니다</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <hr />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">이메일 주소 공개</p>
                        <p className="text-sm text-gray-600">다른 사용자가 내 이메일을 볼 수 있습니다</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPrivacySettings({ ...privacySettings, showEmail: !privacySettings.showEmail })
                        }
                      >
                        {privacySettings.showEmail ? "켜짐" : "꺼짐"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">전화번호 공개</p>
                        <p className="text-sm text-gray-600">다른 사용자가 내 전화번호를 볼 수 있습니다</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPrivacySettings({ ...privacySettings, showPhone: !privacySettings.showPhone })
                        }
                      >
                        {privacySettings.showPhone ? "켜짐" : "꺼짐"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePrivacy} className="bg-primary-500 hover:bg-primary-600">
                    <Save className="w-4 h-4 mr-2" />
                    저장하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>비밀번호 변경</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      현재 비밀번호
                    </label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      >
                        {showPasswords.current ? <Camera className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      새 비밀번호
                    </label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      >
                        {showPasswords.new ? <Camera className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      새 비밀번호 확인
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      >
                        {showPasswords.confirm ? <Camera className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleChangePassword}
                    disabled={
                      !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword
                    }
                    className="bg-primary-500 hover:bg-primary-600"
                  >
                    비밀번호 변경
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>계정 보안</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">2단계 인증</p>
                    <p className="text-sm text-gray-600">계정 보안을 강화하기 위해 2단계 인증을 설정하세요</p>
                  </div>
                  <Button variant="outline" className="bg-transparent">
                    설정하기
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">로그인 기록</p>
                    <p className="text-sm text-gray-600">최근 로그인 기록을 확인하세요</p>
                  </div>
                  <Button variant="outline" className="bg-transparent">
                    확인하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
