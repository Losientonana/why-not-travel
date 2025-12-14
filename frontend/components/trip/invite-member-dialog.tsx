'use client';

import { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createInvitations } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface InviteMemberDialogProps {
  tripId: number;
  tripTitle: string;
}

export function InviteMemberDialog({ tripId, tripTitle }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index: number) => {
    if (emails.length === 1) return;
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const validateEmails = (): string[] => {
    const validEmails = emails
      .map(email => email.trim())
      .filter(email => {
        // 기본 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email && emailRegex.test(email);
      });

    // 중복 제거
    return Array.from(new Set(validEmails));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validEmails = validateEmails();

    if (validEmails.length === 0) {
      toast({
        title: '오류',
        description: '유효한 이메일을 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsLoading(true);
      await createInvitations(tripId, validEmails);

      toast({
        title: '초대 완료',
        description: `${validEmails.length}명에게 초대 이메일을 전송했습니다.`,
      });

      // 초기화
      setEmails(['']);
      setOpen(false);
    } catch (error: any) {
      console.error('❌ [InviteMemberDialog] 초대 실패:', error);
      toast({
        title: '초대 실패',
        description: error.response?.data?.message || '초대를 전송하지 못했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="w-4 h-4 mr-2" />
          멤버 초대
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>여행 멤버 초대</DialogTitle>
          <DialogDescription>
            {tripTitle}에 친구를 초대하세요. 이메일로 초대장이 전송됩니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {emails.map((email, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor={`email-${index}`} className="sr-only">
                    이메일 {index + 1}
                  </Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    required
                  />
                </div>
                {emails.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEmailField(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEmailField}
              className="w-full"
            >
              + 이메일 추가
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '전송 중...' : '초대 보내기'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
