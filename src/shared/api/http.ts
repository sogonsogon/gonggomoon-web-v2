import 'server-only';

import type {
  ApiResponse,
  ApiErrorResponse,
  ApiSuccessResponse,
  ApiErrorDetail,
  RawApiResponse,
} from '@/shared/types/api';
import { cookies } from 'next/headers';

const BASE_API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

type FetchConfig = {
  requireAuth?: boolean;
  accessToken?: string;
  retryOnUnauthorized?: boolean;
};

type RefreshTokenResponse = {
  accessToken: string;
  refreshToken?: string;
};

// 토큰 필요
export async function privateFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const cookieStore = await cookies();
  const currentToken = cookieStore.get('access_token')?.value;

  if (!currentToken) {
    return createErrorResponse('SESSION_EXPIRED', '접근 권한이 없습니다. 다시 로그인해 주세요.');
  }

  return requestApi<T>(endpoint, options, {
    requireAuth: true,
    accessToken: currentToken,
    retryOnUnauthorized: true,
  });
}

// 토큰 불필요
export async function publicFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  return requestApi<T>(endpoint, options, {
    requireAuth: false,
    retryOnUnauthorized: false,
  });
}

async function requestApi<T>(
  endpoint: string,
  options: RequestInit = {},
  config: FetchConfig = {},
): Promise<ApiResponse<T>> {
  const requireAuth = config.requireAuth ?? false;
  const accessToken = config.accessToken;
  const retryOnUnauthorized = config.retryOnUnauthorized ?? false;

  if (!BASE_API_URL) {
    return createErrorResponse('CONFIG_ERROR', 'API_URL이 설정되지 않았습니다.');
  }

  if (requireAuth && !accessToken) {
    return createErrorResponse('SESSION_EXPIRED', '접근 권한이 없습니다. 다시 로그인해 주세요.');
  }

  try {
    const response = await fetchApi(endpoint, options, {
      requireAuth,
      accessToken,
    });

    if (response.status === 401 && requireAuth && retryOnUnauthorized) {
      const refreshed = await refreshAccessToken();

      if (!refreshed.success) {
        await clearAuthCookies();

        return createErrorResponse(
          'SESSION_EXPIRED',
          '로그인 세션이 만료되었습니다. 다시 로그인해 주세요.',
        );
      }

      const retryResponse = await fetchApi(endpoint, options, {
        requireAuth: true,
        accessToken: refreshed.data.accessToken,
      });

      return parseApiResponse<T>(retryResponse);
    }

    return parseApiResponse<T>(response);
  } catch {
    return createErrorResponse('NETWORK_ERROR', '서버와의 통신에 실패했습니다.');
  }
}

async function fetchApi(
  endpoint: string,
  options: RequestInit = {},
  config: {
    requireAuth: boolean;
    accessToken?: string;
  },
): Promise<Response> {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = new Headers(options.headers);

  if (config.requireAuth && config.accessToken) {
    headers.set('Authorization', `Bearer ${config.accessToken}`);
  }

  if (!isFormData) {
    if (!headers.get('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  } else {
    headers.delete('Content-Type');
  }

  return fetch(`${BASE_API_URL}${endpoint}`, {
    ...options,
    method: options.method || 'GET',
    headers,
    cache: 'no-store',
  });
}

async function refreshAccessToken(): Promise<ApiResponse<RefreshTokenResponse>> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return createErrorResponse('SESSION_EXPIRED', 'Refresh token이 없습니다.');
  }

  if (!BASE_API_URL) {
    return createErrorResponse('CONFIG_ERROR', 'API_URL이 설정되지 않았습니다.');
  }

  try {
    const response = await fetch(`${BASE_API_URL}/api/v1/auth/reissue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refresh_token=${refreshToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return createErrorResponse('SESSION_EXPIRED', 'Refresh token이 만료되었습니다.');
    }

    const result = await response.json();

    const newAccessToken = result.data?.accessToken;
    const newRefreshToken = result.data?.refreshToken;

    if (!newAccessToken) {
      return createErrorResponse('INVALID_RESPONSE', '새 access token을 찾을 수 없습니다.');
    }

    cookieStore.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    });

    if (newRefreshToken) {
      cookieStore.set('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return createSuccessResponse<RefreshTokenResponse>(
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      result.code ?? 'SUCCESS',
      result.message ?? '토큰이 갱신되었습니다.',
      result.timestamp ?? new Date().toISOString(),
    );
  } catch {
    return createErrorResponse('NETWORK_ERROR', '토큰 갱신 요청에 실패했습니다.');
  }
}

async function parseApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  let result: RawApiResponse<T>;

  try {
    result = (await response.json()) as RawApiResponse<T>;
  } catch {
    return createErrorResponse('INVALID_RESPONSE', '서버 응답을 해석할 수 없습니다.');
  }

  if (!response.ok) {
    return createErrorResponse(
      result.code ?? `HTTP_${response.status}`,
      result.message ?? '요청에 실패했습니다.',
      result.errors ?? [],
      result.timestamp ?? new Date().toISOString(),
    );
  }

  return createSuccessResponse<T>(
    result.data as T,
    result.code ?? 'SUCCESS',
    result.message ?? '요청에 성공했습니다.',
    result.timestamp ?? new Date().toISOString(),
  );
}

async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}

function createErrorResponse(
  code: string,
  message: string,
  errors: ApiErrorDetail[] = [],
  timestamp: string = new Date().toISOString(),
): ApiErrorResponse {
  return {
    success: false,
    code,
    message,
    data: null,
    errors,
    timestamp,
  };
}

function createSuccessResponse<T>(
  data: T,
  code: string,
  message: string,
  timestamp: string = new Date().toISOString(),
): ApiSuccessResponse<T> {
  return {
    success: true,
    code,
    message,
    data,
    timestamp,
  };
}
