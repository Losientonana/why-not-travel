'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Mail, Calendar, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getMyInvitations } from '@/lib/api';
import { InvitationResponse } from '@/lib/types';

export default function MyInvitationsPage() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setIsLoading(true);
      const data = await getMyInvitations();
      setInvitations(data);
    } catch (error) {
      console.error('❌ [MyInvitations] 초대 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="default">대기 중</Badge>;
      case 'ACCEPTED':
        return <Badge className="bg-green-500">수락됨</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">거절됨</Badge>;
      case 'EXPIRED':
        return <Badge variant="secondary">만료됨</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">초대 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">내 초대 목록</h1>
          <p className="mt-2 text-gray-600">받은 여행 초대를 확인하세요</p>
        </div>

        {invitations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">받은 초대가 없습니다</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <Card
                key={invitation.invitationId}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  if (invitation.status === 'PENDING') {
                    // PENDING 상태일 때만 초대 페이지로 이동
                    const token = invitation.invitedEmail; // 실제로는 relatedData에서 가져와야 하지만 여기서는 간단히 처리
                    // 백엔드에서 token을 함께 반환하도록 수정이 필요할 수 있음
                    router.push(`/invitations/${invitation.invitationId}`);
                  }
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{invitation.tripTitle}</CardTitle>
                      <CardDescription className="mt-1">
                        {invitation.inviterName}님의 초대
                      </CardDescription>
                    </div>
                    {getStatusBadge(invitation.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>초대받은 이메일: {invitation.invitedEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        초대 날짜: {format(new Date(invitation.createdAt), 'yyyy년 M월 d일', { locale: ko })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        만료 날짜: {format(new Date(invitation.expiresAt), 'yyyy년 M월 d일', { locale: ko })}
                      </span>
                    </div>
                  </div>

                  {invitation.status === 'PENDING' && (
                    <div className="mt-4 pt-4 border-t">
                      <Button className="w-full" size="sm">
                        초대 확인하기
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
