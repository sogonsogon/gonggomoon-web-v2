import 'server-only';

import type {
  ApiErrorDetail,
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  RawApiResponse,
} from '@/shared/types/api';
import { cookies } from 'next/headers';

const BASE_API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const ACCESS_TOKEN_MAX_AGE = 60 * 60;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 14;

type FetchConfig = {
  requireAuth: boolean;
  accessToken?: string;
};

type ReissuedTokens = {
  accessToken: string;
  refreshToken: string;
};

type ReissueResponseBody = RawApiResponse<unknown>;

// 토큰 필요
export async function privateFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  if (!BASE_API_URL) {
    return createErrorResponse('CONFIG_ERROR', 'API_URL이 설정되지 않았습니다.');
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    return createErrorResponse(
      'SESSION_EXPIRED',
      '로그인 세션이 만료되었습니다. 다시 로그인해 주세요.',
    );
  }

  try {
    if (!accessToken) {
      const reissued = await refreshAuthTokens(refreshToken);

      if (!reissued.success) {
        return handleReissueFailure(reissued);
      }

      return requestWithReissuedToken<T>(endpoint, options, reissued.data.accessToken);
    }

    const response = await fetchApi(endpoint, options, {
      requireAuth: true,
      accessToken,
    });

    if (response.status !== 401) {
      return parsePrivateApiResponse<T>(response);
    }

    const reissued = await refreshAuthTokens(refreshToken);

    if (!reissued.success) {
      return handleReissueFailure(reissued);
    }

    return requestWithReissuedToken<T>(endpoint, options, reissued.data.accessToken);
  } catch {
    return createErrorResponse('NETWORK_ERROR', '서버와의 통신에 실패했습니다.');
  }
}

// 토큰 불필요
export async function publicFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  if (!BASE_API_URL) {
    return createErrorResponse('CONFIG_ERROR', 'API_URL이 설정되지 않았습니다.');
  }

  try {
    const response = await fetchApi(endpoint, options, {
      requireAuth: false,
    });

    return parseApiResponse<T>(response);
  } catch {
    return createErrorResponse('NETWORK_ERROR', '서버와의 통신에 실패했습니다.');
  }
}

async function requestWithReissuedToken<T>(
  endpoint: string,
  options: RequestInit,
  accessToken: string,
): Promise<ApiResponse<T>> {
  const retryResponse = await fetchApi(endpoint, options, {
    requireAuth: true,
    accessToken,
  });

  if (retryResponse.status === 401) {
    await clearAuthSession();
    return createErrorResponse(
      'SESSION_EXPIRED',
      '로그인 세션이 만료되었습니다. 다시 로그인해 주세요.',
    );
  }

  return parsePrivateApiResponse<T>(retryResponse);
}

async function fetchApi(
  endpoint: string,
  options: RequestInit,
  config: FetchConfig,
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

async function refreshAuthTokens(refreshToken?: string): Promise<ApiResponse<ReissuedTokens>> {
  if (!refreshToken) {
    return createErrorResponse('SESSION_EXPIRED', 'Refresh token이 없습니다.');
  }

  if (!BASE_API_URL) {
    return createErrorResponse('CONFIG_ERROR', 'API_URL이 설정되지 않았습니다.');
  }

  let response: Response;

  try {
    response = await fetch(`${BASE_API_URL}/api/v1/auth/reissue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${REFRESH_TOKEN_COOKIE}=${refreshToken}`,
      },
      cache: 'no-store',
    });
  } catch {
    return createErrorResponse(
      'AUTH_SERVICE_UNAVAILABLE',
      '인증 서버와 통신할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    );
  }

  let body: ReissueResponseBody | null = null;

  try {
    const responseText = await response.text();

    if (responseText) {
      body = JSON.parse(responseText) as ReissueResponseBody;
    }
  } catch {
    body = null;
  }

  if (!response.ok) {
    if ([400, 401, 403].includes(response.status)) {
      return createErrorResponse(
        'SESSION_EXPIRED',
        body?.message ?? 'Refresh token이 만료되었습니다.',
        body?.errors ?? [],
        body?.timestamp,
      );
    }

    return createErrorResponse(
      'AUTH_SERVICE_UNAVAILABLE',
      body?.message ?? '인증 서버를 일시적으로 사용할 수 없습니다.',
      body?.errors ?? [],
      body?.timestamp,
    );
  }

  const setCookieHeaders = response.headers.getSetCookie();
  const newAccessToken = getSetCookieValue(setCookieHeaders, ACCESS_TOKEN_COOKIE);
  const newRefreshToken = getSetCookieValue(setCookieHeaders, REFRESH_TOKEN_COOKIE);

  if (!newAccessToken || !newRefreshToken) {
    return createErrorResponse(
      'SESSION_EXPIRED',
      '토큰 재발급 응답에 필요한 토큰이 없습니다.',
      body?.errors ?? [],
      body?.timestamp,
    );
  }

  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });

  return createSuccessResponse<ReissuedTokens>(
    {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
    body?.code ?? 'SUCCESS',
    body?.message ?? '토큰을 갱신했습니다.',
    body?.timestamp,
  );
}

function getSetCookieValue(setCookieHeaders: string[], cookieName: string): string | undefined {
  for (const setCookieHeader of setCookieHeaders) {
    const cookiePair = setCookieHeader.split(';', 1)[0]?.trim();
    const separatorIndex = cookiePair?.indexOf('=') ?? -1;

    if (!cookiePair || separatorIndex < 1) {
      continue;
    }

    const name = cookiePair.slice(0, separatorIndex).trim();

    if (name !== cookieName) {
      continue;
    }

    const rawValue = cookiePair.slice(separatorIndex + 1).trim();
    const value =
      rawValue.startsWith('"') && rawValue.endsWith('"') ? rawValue.slice(1, -1) : rawValue;

    return value || undefined;
  }

  return undefined;
}

async function handleReissueFailure<T>(error: ApiErrorResponse): Promise<ApiResponse<T>> {
  if (error.code === 'SESSION_EXPIRED') {
    await clearAuthSession();
  }

  return error;
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
      result.timestamp,
    );
  }

  return createSuccessResponse<T>(
    result.data as T,
    result.code ?? 'SUCCESS',
    result.message ?? '요청에 성공했습니다.',
    result.timestamp,
  );
}

async function parsePrivateApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const result = await parseApiResponse<T>(response);

  if (!result.success && result.code === 'SESSION_EXPIRED') {
    await clearAuthSession();
  }

  return result;
}

export async function clearAuthSession() {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
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
