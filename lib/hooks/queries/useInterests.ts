import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/api/endpoints';
import type { InterestsListResponse } from '@/lib/api/schemas';
import { useAuth } from '@/context/auth';

export function useInterests() {
  const { isAuthenticated } = useAuth();

  return useQuery<InterestsListResponse>({
    queryKey: ['interests'],
    queryFn: () => userApi.getInterests(),
    enabled: isAuthenticated,
    staleTime: 30 * 60 * 1000, // 30 minutes - interests don't change often
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}
