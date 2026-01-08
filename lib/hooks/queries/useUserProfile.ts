import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/api/endpoints';
import type { UserProfileResponse } from '@/lib/api/schemas';
import { useAuth } from '@/context/auth';

export function useUserProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery<UserProfileResponse>({
    queryKey: ['user', 'profile'],
    queryFn: () => userApi.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

