'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppNotification } from '@/lib/types';
import { sseService } from '@/lib/sse-service';
import {
  getUnreadNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount
} from '@/lib/api';
import { useAuth } from './auth-context';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (notificationId: number) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 읽지 않은 알림 목록 조회
   */
  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) {
      console.log('⚠️ [Notification] 인증되지 않아 알림 조회 스킵');
      return;
    }

    console.log('📡 [Notification] 알림 목록 조회 시작...');

    try {
      setIsLoading(true);
      const [notifs, count] = await Promise.all([
        getUnreadNotifications(),
        getUnreadNotificationCount()
      ]);

      console.log('📦 [Notification] API 응답:', { notifs, count });
      console.log('📦 [Notification] notifs 타입:', typeof notifs, 'isArray:', Array.isArray(notifs));

      // 배열인지 확인
      if (Array.isArray(notifs)) {
        setNotifications(notifs);
        console.log('✅ [Notification] 알림 목록 조회 완료:', notifs.length, '개, 읽지 않음:', count);
        console.log('📋 [Notification] 알림 상세:', notifs);
      } else {
        console.error('❌ [Notification] API 응답이 배열이 아닙니다:', notifs);
        setNotifications([]);
      }

      setUnreadCount(count);
    } catch (error: any) {
      console.error('❌ [Notification] 알림 목록 조회 실패:', error);
      console.error('❌ [Notification] 에러 상세:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  /**
   * 알림 읽음 처리
   */
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
      console.log('✅ [Notification] 알림 읽음 처리 완료:', notificationId);

      // 로컬 상태 업데이트
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('❌ [Notification] 알림 읽음 처리 실패:', error);
      throw error;
    }
  }, []);

  /**
   * SSE로 새로운 알림 수신 시 처리
   */
  const handleNewNotification = useCallback((notification: AppNotification) => {
    console.log('📨 [Notification] 새 알림 수신:', notification);

    // 중복 체크 후 추가
    setNotifications(prev => {
      const exists = prev.some(n => n.id === notification.id);
      if (exists) {
        console.log('⚠️ [Notification] 이미 존재하는 알림:', notification.id);
        return prev;
      }
      return [notification, ...prev];
    });

    // 읽지 않은 알림이면 카운트 증가
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }

    // 브라우저 알림 표시 (권한이 있는 경우)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.content,
        icon: '/logo.png',
        tag: `notification-${notification.id}`
      });
    }
  }, []);

  /**
   * 로그인 시 SSE 연결 및 알림 조회
   */
  useEffect(() => {
    console.log('🔄 [Notification] useEffect 실행 - isLoggedIn:', isLoggedIn, 'user:', user);

    if (isLoggedIn && user) {
      console.log('🔌 [Notification] 사용자 로그인 감지 - SSE 연결 및 알림 조회');

      // 1. 기존 알림 목록 조회
      fetchNotifications();

      // 2. SSE 연결
      sseService.connect();

      // 3. SSE 이벤트 핸들러 등록
      const unsubscribe = sseService.subscribe(handleNewNotification);

      // 4. 브라우저 알림 권한 요청
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          console.log('🔔 [Notification] 브라우저 알림 권한:', permission);
        });
      }

      return () => {
        console.log('🔌 [Notification] SSE 연결 해제');
        unsubscribe();
        sseService.disconnect();
      };
    } else {
      console.log('⚠️ [Notification] 로그아웃 상태 - 상태 초기화');
      // 로그아웃 시 상태 초기화
      setNotifications([]);
      setUnreadCount(0);
      sseService.disconnect();
    }
  }, [isLoggedIn, user, fetchNotifications, handleNewNotification]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    refreshNotifications: fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
