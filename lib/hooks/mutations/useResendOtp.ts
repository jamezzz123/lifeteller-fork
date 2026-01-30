import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/endpoints';
import type { OtpResendRequest, OtpResendResponse } from '@/lib/api/schemas';

export function useResendOtp() {
  return useMutation<OtpResendResponse, Error, OtpResendRequest>({
    mutationFn: authApi.resendOtp,
  });
}
