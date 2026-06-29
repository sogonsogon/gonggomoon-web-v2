'use server';

import { User } from '@/features/auth/types';
import { MOCK_USER } from '@/features/auth/constants/mock';
import { ApiResponse } from '@/shared/types/api';

export async function getUser(): Promise<ApiResponse<User>> {
  return {
    success: true,
    code: 'SUCCESS',
    message: '',
    data: MOCK_USER,
  };
}

export async function deleteUser(): Promise<ApiResponse<null>> {
  return {
    success: true,
    code: 'SUCCESS',
    message: '',
    data: null,
  };
}
