import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api/endpoints';
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '@/lib/api/schemas';
import { useAuth } from '@/context/auth';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { fetchUserProfile } = useAuth();

  return useMutation<UpdateProfileResponse, Error, UpdateProfileRequest>({
    mutationFn: userApi.updateProfile,
    onSuccess: async (data: UpdateProfileResponse) => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      // Update auth context with new profile
      await fetchUserProfile();
    },
  });
}

