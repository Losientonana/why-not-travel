'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/contexts/notification-context';
import { NotificationItem } from './notification-item';
import { ScrollArea } from '@/components/ui/scroll-area';

export function NotificationDropdown() {
  const { notifications, unreadCount, isLoading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // 디버깅용 로그
  console.log('🔔 [NotificationDropdown] 렌더링:', {
    notificationsType: typeof notifications,
    isArray: Array.isArray(notifications),
    notifications,
    unreadCount,
    isLoading
  });

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hidden sm:flex">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm">알림</h3>
          {unreadCount > 0 && (
            <span className="text-xs text-gray-500">
              {unreadCount}개의 새 알림
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            로딩 중...
          </div>
        ) : !Array.isArray(notifications) || notifications.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            새로운 알림이 없습니다
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="divide-y">
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClose={() => setIsOpen(false)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
