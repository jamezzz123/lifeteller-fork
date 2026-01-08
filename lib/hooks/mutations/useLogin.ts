import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/endpoints';
import type { LoginRequest, LoginResponse } from '@/lib/api/schemas';

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: authApi.login,
  });
}
