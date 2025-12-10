'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, MapPin, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import {
  getInvitationByToken,
  acceptInvitation,
  rejectInvitation
} from '@/lib/api';
import { InvitationDetailResponse } from '@/lib/types';

export default function InvitationPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const token = params.token as string;

  const [invitation, setInvitation] = useState<InvitationDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchInvitation = async () => {
      try {
        setIsLoading(true);
        const data = await getInvitationByToken(token);
        setInvitation(data);
      } catch (err: any) {
        console.error('❌ [Invitation] 초대 정보 조회 실패:', err);
        setError(err.response?.data?.message || '초대 정보를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleAccept = async () => {
    try {
      setIsProcessing(true);
      await acceptInvitation(token);

      // 성공 시 해당 여행 상세 페이지로 이동
      router.push(`/trips/${invitation?.tripId}?accepted=true`);
    } catch (err: any) {
      console.error('❌ [Invitation] 초대 수락 실패:', err);
      setError(err.response?.data?.message || '초대 수락에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsProcessing(true);
      await rejectInvitation(token);

      // 성공 시 메인 페이지로 이동
      router.push('/?rejected=true');
    } catch (err: any) {
      console.error('❌ [Invitation] 초대 거절 실패:', err);
      setError(err.response?.data?.message || '초대 거절에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">초대 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">오류</CardTitle>
            <CardDescription>{error || '초대 정보를 찾을 수 없습니다.'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} className="w-full">
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 초대 상태 확인
  if (invitation.status !== 'PENDING') {
    const statusMessages = {
      ACCEPTED: '이미 수락한 초대입니다.',
      REJECTED: '거절한 초대입니다.',
      EXPIRED: '만료된 초대입니다.'
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>초대 상태</CardTitle>
            <CardDescription>
              {statusMessages[invitation.status as keyof typeof statusMessages]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitation.status === 'ACCEPTED' ? (
              <Button onClick={() => router.push(`/trips/${invitation.tripId}`)} className="w-full">
                여행 보기
              </Button>
            ) : (
              <Button onClick={() => router.push('/')} variant="outline" className="w-full">
                홈으로 돌아가기
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900">
              여행 초대
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              {invitation.inviterName}님이 회원님을 여행에 초대했습니다!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 여행 정보 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {invitation.tripTitle}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{invitation.tripDestination}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>
                    {format(new Date(invitation.tripStartDate), 'yyyy년 M월 d일', { locale: ko })}
                    {' ~ '}
                    {format(new Date(invitation.tripEndDate), 'yyyy년 M월 d일', { locale: ko })}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>초대한 사람: {invitation.inviterName}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>
                    유효기간: {format(new Date(invitation.expiresAt), 'yyyy년 M월 d일까지', { locale: ko })}
                  </span>
                </div>
              </div>
            </div>


            {/* 액션 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleReject}
                variant="outline"
                className="flex-1"
                disabled={isProcessing}
              >
                거절하기
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1"
                disabled={isProcessing}
              >
                {isProcessing ? '처리 중...' : '수락하기'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
