'use client';

import { LoaderCircleIcon } from 'lucide-react';

import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalTitle,
} from '@/shared/components/ui/modal';

interface AiProcessingOverlayProps {
  open: boolean;
  title: string;
  description: string;
}

export default function AiProcessingOverlay({
  open,
  title,
  description,
}: AiProcessingOverlayProps) {
  return (
    <Modal open={open}>
      <ModalContent
        size="sm"
        className="items-center gap-5 px-6 py-8 text-center sm:px-10"
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="flex w-full flex-col items-center gap-5"
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LoaderCircleIcon
              className="size-7 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          </div>

          <div className="grid gap-1.5 break-keep">
            <ModalTitle>{title}</ModalTitle>
            <ModalDescription className="text-sm leading-[1.6]">{description}</ModalDescription>
          </div>

          <div
            className="h-1.5 w-full max-w-[320px] overflow-hidden rounded-full bg-muted"
            aria-hidden="true"
          >
            <div className="ai-processing-progress h-full w-1/3 rounded-full bg-primary motion-reduce:w-full" />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
