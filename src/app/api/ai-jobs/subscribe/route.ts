import type { NextRequest } from 'next/server';

import type { AiJobSseEventType, AiJobSseFailurePayload } from '@/shared/types/ai';
import { isAiJobType } from '@/shared/types/ai';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const BASE_API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
} as const;

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type');
  const id = request.nextUrl.searchParams.get('id')?.trim() ?? '';

  if (!isAiJobType(type)) {
    return createSseEventResponse('failed', {
      status: 400,
      code: 'INVALID_AI_JOB_TYPE',
      message: 'Invalid AI job type.',
    });
  }

  if (!id) {
    return createSseEventResponse('failed', {
      status: 400,
      code: 'INVALID_AI_JOB_ID',
      message: 'Invalid AI job id.',
    });
  }

  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    return createSseEventResponse('failed', {
      status: 401,
      code: 'SESSION_EXPIRED',
      message: 'Authentication is required.',
    });
  }

  if (!BASE_API_URL) {
    return createSseEventResponse('failed', {
      status: 500,
      code: 'CONFIG_ERROR',
      message: 'API URL is not configured.',
    });
  }

  const backendUrl = new URL('/api/v1/ai-jobs/subscribe', BASE_API_URL);
  backendUrl.searchParams.set('type', type);
  backendUrl.searchParams.set('id', id);

  try {
    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
      signal: request.signal,
    });

    if (backendResponse.status === 204) {
      return createSseEventResponse('already_finished', { type, id });
    }

    if (!backendResponse.ok) {
      return createSseEventResponse('failed', {
        status: backendResponse.status,
        code: `HTTP_${backendResponse.status}`,
        message: await resolveBackendErrorMessage(backendResponse),
      });
    }

    if (!backendResponse.body) {
      return createSseEventResponse('failed', {
        status: 502,
        code: 'EMPTY_STREAM',
        message: 'Backend SSE stream is empty.',
      });
    }

    return new Response(backendResponse.body, {
      status: 200,
      headers: SSE_HEADERS,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return createSseEventResponse('failed', {
        code: 'STREAM_ABORTED',
        message: 'SSE connection was aborted.',
      });
    }

    return createSseEventResponse('failed', {
      status: 502,
      code: 'SSE_PROXY_ERROR',
      message: 'Failed to connect to backend SSE stream.',
    });
  }
}

function createSseEventResponse<TPayload>(event: AiJobSseEventType, payload: TPayload): Response {
  return new Response(formatSseEvent(event, payload), {
    status: 200,
    headers: SSE_HEADERS,
  });
}

function formatSseEvent<TPayload>(event: AiJobSseEventType, payload: TPayload) {
  return `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
}

async function resolveBackendErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as Partial<AiJobSseFailurePayload>;
    return payload.message ?? 'AI job subscription failed.';
  } catch {
    return response.statusText || 'AI job subscription failed.';
  }
}
