'use server';

import { User } from '@/features/auth/types';
import { ApiResponse } from '@/shared/types/api';
import { clearAuthSession, privateFetch } from '@/shared/api/http';

export async function getUser(): Promise<ApiResponse<User>> {
  const response = await privateFetch<User>('/api/v1/users/me');
  return response;
}

export async function deleteUser(): Promise<ApiResponse<null>> {
  const response = await privateFetch<null>('/api/v1/users/me', {
    method: 'DELETE',
  });

  await clearAuthSession();

  return response;
}

export async function logout(): Promise<ApiResponse<null>> {
  const response = await privateFetch<null>('/api/v1/auth/logout', {
    method: 'POST',
  });
  await clearAuthSession();

  return response;
}
