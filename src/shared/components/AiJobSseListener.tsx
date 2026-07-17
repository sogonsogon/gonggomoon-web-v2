'use client';

import * as React from 'react';

import type {
  AiJobSseAlreadyFinishedPayload,
  AiJobSseFailurePayload,
  AiJobStatusPayload,
  AiJobSubscribeTarget,
} from '@/shared/types/ai';

type AiJobSseListenerProps = AiJobSubscribeTarget & {
  onDone: (payload: AiJobStatusPayload) => void;
  onFailed: (payload: AiJobSseFailurePayload) => void;
  onAlreadyFinished: (payload: AiJobSseAlreadyFinishedPayload) => void;
};

export default function AiJobSseListener({
  type,
  id,
  onDone,
  onFailed,
  onAlreadyFinished,
}: AiJobSseListenerProps) {
  const callbacksRef = React.useRef({
    onDone,
    onFailed,
    onAlreadyFinished,
  });

  React.useEffect(() => {
    callbacksRef.current = {
      onDone,
      onFailed,
      onAlreadyFinished,
    };
  }, [onAlreadyFinished, onDone, onFailed]);

  React.useEffect(() => {
    const params = new URLSearchParams({
      type,
      id: String(id),
    });
    const eventSource = new EventSource(`/api/ai-jobs/subscribe?${params.toString()}`);
    let closed = false;

    const close = () => {
      if (!closed) {
        closed = true;
        eventSource.close();
      }
    };

    eventSource.addEventListener('already_finished', (event) => {
      callbacksRef.current.onAlreadyFinished(
        parseEventData<AiJobSseAlreadyFinishedPayload>(event.data, {
          type,
          id: String(id),
        }),
      );
      close();
    });

    eventSource.addEventListener('failed', (event) => {
      callbacksRef.current.onFailed(
        parseEventData<AiJobSseFailurePayload>(event.data, {}),
      );
      close();
    });

    eventSource.addEventListener('ai-job-status', (event) => {
      const payload = parseEventData<AiJobStatusPayload | null>(event.data, null);

      if (!payload) {
        return;
      }

      if (payload.status === 'PROCESSING') {
        return;
      }

      if (payload.status === 'READY') {
        callbacksRef.current.onDone({
          ...payload,
          id: payload.id ?? id,
          type: payload.type ?? type,
          status: payload.status,
        });
        close();
        return;
      }

      if (payload.status === 'FAILED') {
        callbacksRef.current.onFailed({
          code: payload.code,
          message: payload.message,
        });
        close();
      }
    });

    eventSource.onerror = () => {
      callbacksRef.current.onFailed({
        message: 'AI job SSE connection failed.',
      });
      close();
    };

    return close;
  }, [id, type]);

  return null;
}

function parseEventData<TPayload>(data: string, fallback: TPayload): TPayload {
  if (!data) {
    return fallback;
  }

  try {
    return JSON.parse(data) as TPayload;
  } catch {
    return fallback;
  }
}
