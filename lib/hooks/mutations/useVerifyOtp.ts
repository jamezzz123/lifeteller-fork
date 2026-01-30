import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/endpoints';
import type { OtpVerifyRequest, OtpVerifyResponse } from '@/lib/api/schemas';

export function useVerifyOtp() {
  return useMutation<OtpVerifyResponse, Error, OtpVerifyRequest>({
    mutationFn: authApi.verifyOtp,
  });
}
