import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/endpoints';
import type {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/lib/api/schemas';

export function useRefreshToken() {
  return useMutation<RefreshTokenResponse, Error, RefreshTokenRequest>({
    mutationFn: authApi.refreshToken,
  });
}
