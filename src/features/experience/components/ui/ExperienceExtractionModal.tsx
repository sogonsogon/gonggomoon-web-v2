'use client';

import * as React from 'react';
import { FileTextIcon, FileUpIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import { experienceKeys, useStartExtractExperience } from '@/features/experience/queries';
import AiJobSseListener from '@/shared/components/AiJobSseListener';
import AiProcessingOverlay from '@/shared/components/ui/AiProcessingOverlay';
import { Button } from '@/shared/components/ui/button';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/shared/components/ui/modal';
import type { AiJobSseFailurePayload } from '@/shared/types/ai';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface ExperienceExtractionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExperienceExtractionModal({
  open,
  onOpenChange,
}: ExperienceExtractionModalProps) {
  const queryClient = useQueryClient();
  const { mutate: startExtractExperience, isPending: isStartExtractExperiencePending } =
    useStartExtractExperience();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [pendingExtractionId, setPendingExtractionId] = React.useState<number | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const resetSelectedFile = React.useCallback(() => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetSelectedFile();
      }

      onOpenChange(nextOpen);
    },
    [onOpenChange, resetSelectedFile],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!isPdfFile(file)) {
      resetSelectedFile();
      toast.error('PDF 파일만 업로드할 수 있습니다.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      resetSelectedFile();
      toast.error('10MB 이하 PDF 파일만 업로드할 수 있습니다.');
      return;
    }

    setSelectedFile(file);
  };

  const handleExtract = () => {
    if (isProcessing) {
      return;
    }

    if (!selectedFile) {
      toast.error('추출할 PDF 파일을 선택해주세요.');
      return;
    }

    const fileToUpload = selectedFile;

    setIsProcessing(true);
    handleOpenChange(false);

    startExtractExperience(fileToUpload, {
      onSuccess: (result) => {
        const extractionId = result.extractionId;

        if (!extractionId) {
          setIsProcessing(false);
          toast.error('경험을 추출하지 못했습니다. 다시 시도해주세요.');
          return;
        }

        setPendingExtractionId(extractionId);
      },
      onError: (error) => {
        setIsProcessing(false);
        toast.error(error.message || '경험을 추출하지 못했습니다. 다시 시도해주세요.');
      },
    });
  };

  const handleFinished = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: experienceKeys.list() });
    setPendingExtractionId(null);
    setIsProcessing(false);
    toast.success('경험 추출이 완료되었습니다.');
  }, [queryClient]);

  const handleFailed = React.useCallback((payload: AiJobSseFailurePayload) => {
    setPendingExtractionId(null);
    setIsProcessing(false);
    toast.error(payload.message || '경험을 추출하지 못했습니다. 다시 시도해주세요.');
  }, []);

  return (
    <>
      {!isProcessing ? (
        <Modal open={open} onOpenChange={handleOpenChange}>
          <ModalContent size="md">
            <ModalHeader
              title="경험 추출"
              description="이력서나 포트폴리오 파일에서 경험을 자동으로 추출하세요."
            />

            <div className="grid gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={handleFileChange}
              />
              <div className="flex min-h-[156px] flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-primary/40 bg-primary/5 px-5 py-8 text-center">
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FileUpIcon className="size-5" aria-hidden="true" />
                </div>
                <div className="grid gap-1">
                  <p className="text-sm leading-[1.45] font-bold text-foreground">파일 선택</p>
                  <p className="text-xs leading-[1.45] text-muted-foreground">
                    10MB 이하 PDF 파일을 업로드하세요.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  파일 선택
                </Button>
              </div>

              {selectedFile ? (
                <div className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border bg-card px-3 py-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-primary/10 text-primary">
                    <FileTextIcon className="size-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm leading-[1.45] font-bold text-foreground">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs leading-[1.45] text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleOpenChange(false)}
              >
                취소
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!selectedFile || isProcessing || isStartExtractExperiencePending}
                onClick={handleExtract}
              >
                추출하기
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : null}

      <AiProcessingOverlay
        open={isProcessing}
        title="경험을 추출하고 있어요"
        description="업로드한 문서에서 주요 경험을 찾고 있어요. 잠시만 기다려주세요."
      />

      {pendingExtractionId ? (
        <AiJobSseListener
          type="EXTRACT_EXPERIENCE"
          id={pendingExtractionId}
          onDone={handleFinished}
          onAlreadyFinished={handleFinished}
          onFailed={handleFailed}
        />
      ) : null}
    </>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)}KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}

function isPdfFile(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}
