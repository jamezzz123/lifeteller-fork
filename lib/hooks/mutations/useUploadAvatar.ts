import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api/endpoints';
import type { UploadAvatarResponse } from '@/lib/api/schemas';
import { useAuth } from '@/context/auth';

interface UploadAvatarParams {
  uri: string;
  type: string;
  name: string;
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { fetchUserProfile } = useAuth();

  return useMutation<UploadAvatarResponse, Error, UploadAvatarParams>({
    mutationFn: ({ uri, type, name }) =>
      userApi.uploadAvatar({ uri, type, name }),
    onSuccess: async (data) => {
      try {
        // Update auth context with new profile first
        await fetchUserProfile();
        // Then invalidate queries to ensure UI updates
        queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
        queryClient.invalidateQueries({ queryKey: ['user'] });
      } catch {
        // Still invalidate queries even if fetch fails
        queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    },
  });
}
