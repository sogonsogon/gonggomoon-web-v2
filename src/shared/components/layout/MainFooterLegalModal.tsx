'use client';

import * as React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Modal, ModalContent, ModalHeader } from '@/shared/components/ui/modal';

export type MainFooterLegalModalType = 'terms' | 'privacy';

type MainFooterLegalModalProps = {
  type: MainFooterLegalModalType | null;
  onOpenChange: (open: boolean) => void;
};

const legalDocuments: Record<
  MainFooterLegalModalType,
  { title: string; description: string; href: string }
> = {
  terms: {
    title: '서비스 이용약관',
    description: '서비스 이용약관 문서 내용을 확인합니다.',
    href: '/legal/terms.md',
  },
  privacy: {
    title: '개인정보처리방침',
    description: '개인정보처리방침 문서 내용을 확인합니다.',
    href: '/legal/privacy.md',
  },
};

export default function MainFooterLegalModal({ type, onOpenChange }: MainFooterLegalModalProps) {
  const [markdownByType, setMarkdownByType] = React.useState<
    Partial<Record<MainFooterLegalModalType, string>>
  >({});
  const [errorByType, setErrorByType] = React.useState<
    Partial<Record<MainFooterLegalModalType, string>>
  >({});

  const document = type ? legalDocuments[type] : null;
  const markdown = type ? markdownByType[type] : undefined;
  const error = type ? errorByType[type] : undefined;

  React.useEffect(() => {
    if (!type || markdownByType[type] || errorByType[type]) {
      return;
    }

    const controller = new AbortController();

    fetch(legalDocuments[type].href, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load legal document.');
        }

        return response.text();
      })
      .then((nextMarkdown) => {
        setMarkdownByType((previous) => ({
          ...previous,
          [type]: nextMarkdown,
        }));
      })
      .catch((fetchError: unknown) => {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          return;
        }

        setErrorByType((previous) => ({
          ...previous,
          [type]: '문서를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        }));
      });

    return () => controller.abort();
  }, [errorByType, markdownByType, type]);

  return (
    <Modal open={type !== null} onOpenChange={onOpenChange}>
      <ModalContent size="lg" className="overflow-hidden">
        {document ? (
          <>
            <ModalHeader title={document.title} description={document.description} />
            <div className="min-h-0 overflow-y-auto pr-1">
              {error ? (
                <p className="text-sm leading-[1.6] text-muted-foreground">{error}</p>
              ) : markdown ? (
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ ...props }) => (
                      <h1 className="text-xl leading-[1.35] font-bold text-foreground" {...props} />
                    ),
                    h2: ({ ...props }) => (
                      <h2
                        className="mt-6 text-base leading-[1.45] font-semibold text-foreground first:mt-0"
                        {...props}
                      />
                    ),
                    h3: ({ ...props }) => (
                      <h3
                        className="mt-4 text-sm leading-[1.45] font-semibold text-foreground"
                        {...props}
                      />
                    ),
                    p: ({ ...props }) => (
                      <p className="text-sm leading-[1.7] text-muted-foreground" {...props} />
                    ),
                    ul: ({ ...props }) => (
                      <ul
                        className="my-3 list-disc space-y-1.5 pl-5 text-sm leading-[1.7] text-muted-foreground"
                        {...props}
                      />
                    ),
                    ol: ({ ...props }) => (
                      <ol
                        className="my-3 list-decimal space-y-1.5 pl-5 text-sm leading-[1.7] text-muted-foreground"
                        {...props}
                      />
                    ),
                    li: ({ ...props }) => <li className="pl-1" {...props} />,
                    hr: ({ ...props }) => <hr className="my-5 border-border/60" {...props} />,
                    strong: ({ ...props }) => (
                      <strong className="font-semibold text-foreground" {...props} />
                    ),
                    a: ({ ...props }) => (
                      <a
                        className="text-primary underline-offset-4 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                        {...props}
                      />
                    ),
                  }}
                >
                  {markdown}
                </Markdown>
              ) : (
                <p className="text-sm leading-[1.6] text-muted-foreground">
                  문서를 불러오는 중입니다.
                </p>
              )}
            </div>
          </>
        ) : null}
      </ModalContent>
    </Modal>
  );
}
