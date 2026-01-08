import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/endpoints';
import type { RegisterRequest, RegisterResponse } from '@/lib/api/schemas';
import { useAuth } from '@/context/auth';

export function useRegister() {
  const { login: setAuthState } = useAuth();

  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: authApi.register,
    retry: false, // Disable retry for registration to prevent duplicate calls
    onSuccess: async (data: RegisterResponse) => {
      console.log('useRegister onSuccess called:', data);
      // Update auth context state
      // Convert null to undefined for onboarding_complete to match the expected type
      await setAuthState({
        access: data.data.access,
        refresh: data.data.refresh,
        userId: data.data.user_id,
        onboardingComplete: data.onboarding_complete ?? undefined,
      });

      // Note: Navigation is handled in the component to avoid conflicts
      // The component will check verification status and navigate accordingly
    },
  });
}
