'use client';

import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Bell, Calendar, MessageCircle, Info } from 'lucide-react';
import { AppNotification, NotificationType } from '@/lib/types';
import { useNotifications } from '@/contexts/notification-context';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: AppNotification;
  onClose?: () => void;
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const router = useRouter();
  const { markAsRead } = useNotifications();

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'INVITATION':
        return <Bell className="w-5 h-5 text-blue-500" />;
      case 'TRIP_UPDATE':
        return <Calendar className="w-5 h-5 text-green-500" />;
      case 'COMMENT':
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
      case 'SETTLEMENT_REQUEST':
        return <Bell className="w-5 h-5 text-yellow-500" />;
      case 'SETTLEMENT_APPROVED':
        return <Bell className="w-5 h-5 text-green-500" />;
      case 'SETTLEMENT_REJECTED':
        return <Bell className="w-5 h-5 text-red-500" />;
      case 'SETTLEMENT_COMPLETED':
        return <Bell className="w-5 h-5 text-blue-500" />;
      case 'SYSTEM':
        return <Info className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleClick = async () => {
    try {
      // 읽지 않은 알림이면 읽음 처리
      if (!notification.isRead) {
        await markAsRead(notification.id);
      }

      // 초대 알림인 경우 초대 페이지로 이동
      if (notification.type === 'INVITATION' && notification.relatedData) {
        router.push(`/invitations/${notification.relatedData}`);
      }

      // 정산 알림인 경우 여행 페이지로 이동 (relatedData 형식: "tripId:settlementId")
      if (
        (notification.type === 'SETTLEMENT_REQUEST' ||
         notification.type === 'SETTLEMENT_APPROVED' ||
         notification.type === 'SETTLEMENT_REJECTED' ||
         notification.type === 'SETTLEMENT_COMPLETED') &&
        notification.relatedData
      ) {
        const [tripId] = notification.relatedData.split(':');
        if (tripId) {
          router.push(`/trips/${tripId}`);
        }
      }

      // 드롭다운 닫기
      onClose?.();
    } catch (error) {
      console.error('❌ [NotificationItem] 알림 처리 실패:', error);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: ko
  });

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full p-4 text-left hover:bg-gray-50 transition-colors',
        !notification.isRead && 'bg-blue-50'
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={cn(
              'text-sm',
              !notification.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
            )}>
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {notification.content}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {timeAgo}
          </p>
        </div>
      </div>
    </button>
  );
}
