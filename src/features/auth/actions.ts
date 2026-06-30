'use server';

import { User } from '@/features/auth/types';
import { MOCK_USER } from '@/features/auth/constants/mock';
import { ApiResponse } from '@/shared/types/api';
import { privateFetch } from '@/shared/api/http';
import { cookies } from 'next/headers';

export async function getUser(): Promise<ApiResponse<User>> {
  const response = privateFetch<User>('/api/v1/users/me');
  return response;
}

export async function deleteUser(): Promise<ApiResponse<null>> {
  const response = await privateFetch<null>('/api/v1/users/me', {
    method: 'DELETE',
  });

  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');

  return response;
}

export async function logout(): Promise<ApiResponse<null>> {
  const response = await privateFetch<null>('/api/v1/auth/logout', {
    method: 'POST',
  });
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');

  return response;
}
