import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/lib/api/endpoints';

export function useCheckUsername(username: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ['checkUsername', username],
    queryFn: async () => {
      console.log('Checking username:', username);
      const result = await authApi.checkUsername({ username });
      return result;
    },
    enabled: enabled && username.trim().length > 0,
    retry: false,
    staleTime: 0, // Always check fresh
    gcTime: 0, // Don't cache, always fetch fresh
  });
}
