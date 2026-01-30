import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/lib/api/endpoints';

export function useUsernameSuggestions(
  username: string,
  enabled: boolean = false
) {
  return useQuery({
    queryKey: ['usernameSuggestions', username],
    queryFn: () => authApi.usernameSuggestions({ username }),
    enabled: enabled && username.trim().length > 0,
    retry: false,
    staleTime: 0,
  });
}
