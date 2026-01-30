import { useMutation } from '@tanstack/react-query';
import { liftsApi } from '@/lib/api/endpoints';
import type { RaiseLiftRequest, RaiseLiftResponse } from '@/lib/api/schemas';

export function useRaiseLift() {
  return useMutation<RaiseLiftResponse, Error, RaiseLiftRequest>({
    mutationFn: liftsApi.raise,
  });
}
