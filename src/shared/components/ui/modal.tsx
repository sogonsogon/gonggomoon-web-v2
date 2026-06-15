'use client';

{
  // 사용 예시 입니다.
  /* 
  import { Button } from '@/shared/components/ui/button';
  import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/shared/components/ui/modal';

  interface ModalTestProps {
    open: boolean;
    setOpen: (next: boolean) => void;
  }

  export default function ModalTest({ open, setOpen }: ModalTestProps) {
    return (
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent size="md">
          <ModalHeader title="경험 등록" description="경험을 직접 작성하고 등록하세요" />
          <div>...</div>
          <ModalFooter>
            <Button variant="outline" size="sm">
              취소
            </Button>
            <Button size="sm">저장</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
*/
}

import * as React from 'react';
import { XIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

const modalContentVariants = cva(
  'flex max-h-[calc(100svh-2rem)] flex-col gap-[var(--gap-lg)] overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-card p-6 text-foreground shadow-[0_18px_40px_#00000024]',
  {
    variants: {
      size: {
        sm: 'sm:max-w-[460px]',
        md: 'sm:max-w-[500px]',
        lg: 'sm:max-w-[560px]',
        xl: 'sm:max-w-[760px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

function Modal({ ...props }: React.ComponentProps<typeof Dialog>) {
  return <Dialog {...props} />;
}

function ModalTrigger({ ...props }: React.ComponentProps<typeof DialogTrigger>) {
  return <DialogTrigger {...props} />;
}

function ModalClose({ className, ...props }: React.ComponentProps<typeof DialogClose>) {
  return (
    <DialogClose
      className={cn(
        'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[18px]',
        className,
      )}
      {...props}
    />
  );
}

function ModalContent({
  className,
  size,
  children,
  ...props
}: React.ComponentProps<typeof DialogContent> & VariantProps<typeof modalContentVariants>) {
  return (
    <DialogContent
      showCloseButton={false}
      className={cn(modalContentVariants({ size }), className)}
      {...props}
    >
      {children}
    </DialogContent>
  );
}

function ModalHeader({
  className,
  children,
  title,
  description,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogHeader> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  showCloseButton?: boolean;
}) {
  return (
    <DialogHeader
      className={cn(
        'flex-row items-start justify-between gap-[var(--gap-md)] text-left',
        className,
      )}
      {...props}
    >
      <div className="grid flex-1 gap-1">
        {title ? <ModalTitle>{title}</ModalTitle> : null}
        {description ? <ModalDescription>{description}</ModalDescription> : null}
        {children}
      </div>
      {showCloseButton ? (
        <ModalClose>
          <XIcon />
          <span className="sr-only">닫기</span>
        </ModalClose>
      ) : null}
    </DialogHeader>
  );
}

function ModalTitle({ className, ...props }: React.ComponentProps<typeof DialogTitle>) {
  return (
    <DialogTitle
      className={cn('text-xl leading-[1.35] font-bold text-foreground', className)}
      {...props}
    />
  );
}

function ModalDescription({ className, ...props }: React.ComponentProps<typeof DialogDescription>) {
  return (
    <DialogDescription
      className={cn('text-[13px] leading-[1.45] text-muted-foreground', className)}
      {...props}
    />
  );
}

function ModalFooter({ className, ...props }: React.ComponentProps<typeof DialogFooter>) {
  return (
    <DialogFooter
      className={cn('flex-row justify-end gap-[var(--gap-sm)] sm:justify-end', className)}
      {...props}
    />
  );
}

export {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
};
