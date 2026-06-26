'use client';

import * as React from 'react';
import { LogOutIcon, TriangleAlertIcon, UserXIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/shared/components/ui/modal';
import { Separator } from '@/shared/components/ui/separator';
import { useDeleteUser, useGetUser } from '@/features/auth/queries';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type SettingsModalView = 'settings' | 'withdraw';

type SettingsModalUser = {
  name: string;
  email: string;
  profileImageUrl?: string | null;
};

type SettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: SettingsModalUser;
};

export default function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { data } = useGetUser();
  const [view, setView] = React.useState<SettingsModalView>('settings');
  const [confirmEmail, setConfirmEmail] = React.useState('');
  const [checked, setChecked] = React.useState(false);

  const resetWithdrawState = React.useCallback(() => {
    setConfirmEmail('');
    setChecked(false);
  }, []);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setView('settings');
        resetWithdrawState();
      }

      onOpenChange(nextOpen);
    },
    [onOpenChange, resetWithdrawState],
  );

  const handleWithdrawCancel = React.useCallback(() => {
    resetWithdrawState();
    setView('settings');
  }, [resetWithdrawState]);
  const { mutate: deleteUser, isPending } = useDeleteUser();
  const router = useRouter();

  const handleConfirm = () => {
    if (!setChecked || isPending) return;
    deleteUser(undefined, {
      onSuccess: () => {
        toast.success('회원 탈퇴가 완료되었습니다.');
        router.replace('/');

        handleOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message || '회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.');
      },
    });
  };

  if (!data) return null;

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size="md" className="gap-4">
        {view === 'settings' ? (
          <SettingsView user={data} onWithdrawClick={() => setView('withdraw')} />
        ) : (
          <WithdrawView
            user={data}
            confirmEmail={confirmEmail}
            checked={checked}
            onConfirmEmailChange={setConfirmEmail}
            onCheckedChange={setChecked}
            onCancel={handleWithdrawCancel}
            onConfirm={handleConfirm}
          />
        )}
      </ModalContent>
    </Modal>
  );
}

function SettingsView({
  user,
  onWithdrawClick,
}: {
  user: Required<SettingsModalUser>;
  onWithdrawClick: () => void;
}) {
  return (
    <>
      <ModalHeader title="설정" description="계정 정보와 보안 관련 작업을 관리합니다" />

      <section className="grid gap-2">
        <h3 className="text-[15px] leading-[1.42] font-bold text-foreground">프로필 정보</h3>
        <div className="grid rounded-[var(--radius-md)] border border-border bg-muted/70 px-4 py-1">
          <ProfileRow label="프로필 사진">
            <UserAvatar user={user} size="lg" />
          </ProfileRow>
          <Separator className="bg-border-subtle" />
          <ProfileRow label="이름">
            <span className="truncate text-[13px] leading-[1.42] font-semibold whitespace-nowrap text-foreground">
              {user.name}
            </span>
          </ProfileRow>
          <Separator className="bg-border-subtle" />
          <ProfileRow label="이메일">
            <span className="truncate text-[13px] leading-[1.42] font-semibold whitespace-nowrap text-foreground">
              {user.email}
            </span>
          </ProfileRow>
        </div>
      </section>

      <Button type="button" variant="outline" size="sm" className="w-full">
        <LogOutIcon className="size-4" aria-hidden="true" />
        로그아웃
      </Button>

      <button
        type="button"
        className="mx-auto cursor-pointer text-xs leading-[1.4] font-medium text-subtle-foreground transition-colors hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        onClick={onWithdrawClick}
      >
        회원탈퇴
      </button>
    </>
  );
}

function WithdrawView({
  user,
  confirmEmail,
  checked,
  onConfirmEmailChange,
  onCheckedChange,
  onCancel,
  onConfirm,
}: {
  user: Required<SettingsModalUser>;
  confirmEmail: string;
  checked: boolean;
  onConfirmEmailChange: (value: string) => void;
  onCheckedChange: (value: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const canWithdraw = confirmEmail.trim() === user.email && checked;

  return (
    <>
      <div className="flex items-start gap-[var(--gap-lg)]">
        <div className="flex size-[42px] shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-card">
          <TriangleAlertIcon className="size-5 text-destructive" aria-hidden="true" />
        </div>
        <ModalHeader
          className="flex-1"
          title="회원탈퇴를 진행할까요?"
          description="탈퇴가 완료되면 계정과 저장된 데이터는 복구할 수 없습니다"
          showCloseButton={false}
        />
      </div>

      <section className="grid gap-2.5 rounded-[var(--radius-lg)] border border-destructive/25 bg-destructive/5 px-[18px] py-4">
        <h3 className="text-[15px] leading-[1.42] font-bold text-destructive">
          탈퇴 시 삭제되는 내용
        </h3>
        <ul className="grid gap-[7px]">
          {[
            '저장된 포트폴리오 전략이 삭제됩니다.',
            '등록한 경험 데이터가 삭제됩니다.',
            '탈퇴 후 같은 이메일로 재가입할 수 있지만 삭제된 데이터는 복구되지 않습니다.',
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-[13px] leading-[1.42] text-muted-foreground"
            >
              <span className="mt-[7px] size-[5px] shrink-0 rounded-full bg-destructive" />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <label className="grid gap-2">
        <span className="text-[13px] leading-[1.42] font-bold text-foreground">확인 문구 입력</span>
        <Input
          value={confirmEmail}
          placeholder={user.email}
          className="h-11 bg-card text-sm"
          onChange={(event) => onConfirmEmailChange(event.target.value)}
        />
      </label>

      <label className="flex cursor-pointer items-center gap-2.5 px-1">
        <Checkbox
          checked={checked}
          className="size-[18px]"
          onCheckedChange={(value) => onCheckedChange(value === true)}
        />
        <span className="min-w-0 text-[13px] leading-[1.42] text-muted-foreground">
          위 내용을 모두 확인했고 회원탈퇴를 진행합니다.
        </span>
      </label>

      <ModalFooter>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          취소
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={!canWithdraw}
          onClick={onConfirm}
        >
          <UserXIcon className="size-4" aria-hidden="true" />
          회원탈퇴
        </Button>
      </ModalFooter>
    </>
  );
}

function ProfileRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[38px] items-center justify-between gap-[var(--gap-md)] py-2.5">
      <span className="text-[13px] leading-[1.42] font-medium text-muted-foreground">{label}</span>
      <div className="min-w-0 shrink-0">{children}</div>
    </div>
  );
}

function UserAvatar({ user, size }: { user: Required<SettingsModalUser>; size: 'md' | 'lg' }) {
  return (
    <Avatar className={size === 'lg' ? 'size-14 text-[15px]' : 'size-10 text-[15px]'}>
      <AvatarImage src={user.profileImageUrl || undefined} alt={`${user.name} 프로필`} />
      <AvatarFallback className="font-bold text-foreground">{user.name.slice(0, 1)}</AvatarFallback>
    </Avatar>
  );
}
