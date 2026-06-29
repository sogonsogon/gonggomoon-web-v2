'use client';

import * as React from 'react';
import Image from 'next/image';

import LegalModal, { type LegalModalType } from '@/shared/components/layout/LegalModal';
import logoImage from '@/shared/assets/images/logo.png';
import { Modal, ModalContent, ModalDescription, ModalTitle } from '@/shared/components/ui/modal';
import { useLoginModal } from '@/features/auth/store/useLoginModal';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginModal() {
  const { isDialogOpen, openDialog, closeDialog } = useLoginModal();
  const [legalModalType, setLegalModalType] = React.useState<LegalModalType | null>(null);
  const router = useRouter();

  const openLegalModal = (type: LegalModalType) => {
    setLegalModalType(type);
  };

  const handleOpenChange = () => {
    if (isDialogOpen) {
      closeDialog();
      return;
    }
    openDialog();
  };

  const handleLogin = async () => {
    const popup = window.open(
      `${BASE_API_URL}/api/v1/auth/social/login/naver`,
      'auth-popup',
      'width=500,height=600',
    );
    if (!popup) {
      toast.error('팝업이 차단 되어 있습니다. 설정창을 확인해주세요');
      return;
    }

    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === 'AUTH_SUCCESS') {
        window.removeEventListener('message', handler);
        // 유저 정보 갱신, 모달 닫기 등
        closeDialog();
        router.refresh();
      }
    };
    window.addEventListener('message', handler);
  };

  return (
    <>
      <Modal open={isDialogOpen} onOpenChange={handleOpenChange}>
        <ModalContent
          size="sm"
          className="items-center gap-6 px-6 py-8 text-center sm:px-10"
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <ModalTitle className="sr-only">로그인</ModalTitle>

          <Image
            src={logoImage}
            alt="공고문"
            className="h-auto w-40 max-w-full object-contain"
            priority
          />

          <ModalDescription className="text-sm line-clamp-2 break-keep text-gray-700">
            지금 바로 로그인하고 포폴 전략을 생성해보세요
          </ModalDescription>

          <button
            type="button"
            className="grid h-12 w-full max-w-[368px] cursor-pointer grid-cols-[48px_1fr_48px] items-center rounded-[var(--radius-sm)] bg-[#03a94d] text-white transition-colors hover:bg-[#029744] focus-visible:ring-2 focus-visible:ring-[#03a94d]/50 focus-visible:ring-offset-2 focus-visible:outline-none"
            onClick={handleLogin}
          >
            <span aria-hidden="true" className="text-xl leading-none font-black">
              N
            </span>
            <span className="text-base font-semibold">네이버 계정으로 시작하기</span>
            <span aria-hidden="true" />
          </button>

          <div className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground">
            <button
              type="button"
              className="cursor-pointer transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              onClick={() => openLegalModal('terms')}
            >
              이용약관
            </button>
            <button
              type="button"
              className="cursor-pointer transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              onClick={() => openLegalModal('privacy')}
            >
              개인정보처리방침
            </button>
          </div>
        </ModalContent>
      </Modal>

      <LegalModal
        type={legalModalType}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setLegalModalType(null);
          }
        }}
      />
    </>
  );
}
