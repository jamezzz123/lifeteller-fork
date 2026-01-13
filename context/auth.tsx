import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import type { UserProfileData } from '@/lib/api/schemas';
import { userApi, authApi } from '@/lib/api/endpoints';
import { authEvents } from '@/lib/utils/authEvents';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfileData | null;
  userId: string | null;
  onboardingComplete: boolean;
  login: (tokens: {
    access: string;
    refresh: string;
    userId: string;
    onboardingComplete?: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    await SecureStore.deleteItemAsync('user_id');
    await SecureStore.deleteItemAsync('keep_logged_in');
    setIsAuthenticated(false);
    setUserId(null);
    setUser(null);
    setOnboardingComplete(false);
  }, []);

  const fetchUserProfile = useCallback(async () => {
    const response = await userApi.getProfile();
    setUser(response.data);
    setUserId(response.data.id);
    setOnboardingComplete(response.onboarding_complete ?? false);
    // Let errors bubble up so they can be handled by the caller
  }, []);

  const refreshAuthToken = useCallback(
    async (refresh: string) => {
      try {
        const response = await authApi.refreshToken({ refresh });

        // Store new tokens
        await SecureStore.setItemAsync('access_token', response.data.access);
        await SecureStore.setItemAsync('refresh_token', response.data.refresh);
        await SecureStore.setItemAsync('user_id', response.data.user_id);

        setUserId(response.data.user_id);
        setOnboardingComplete(response.onboarding_complete ?? false);

        // Fetch user profile to get full user data
        // Only set authenticated after successful profile fetch
        try {
          await fetchUserProfile();
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user profile after refresh:', error);
          // Profile fetch failed, but token refresh succeeded
          // Set authenticated anyway since we have valid tokens
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        // Refresh failed, logout user
        await logout();
      }
    },
    [fetchUserProfile, logout]
  );

  const checkAuth = useCallback(async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('access_token');
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      const storedUserId = await SecureStore.getItemAsync('user_id');
      const keepLoggedIn = await SecureStore.getItemAsync('keep_logged_in');

      // If we have an access token, try to use it
      if (accessToken && storedUserId) {
        // Don't set isAuthenticated yet - verify token first by fetching profile
        setUserId(storedUserId);
        // Fetch user profile to verify token is still valid
        try {
          await fetchUserProfile();
          // Only set authenticated after successful profile fetch
          setIsAuthenticated(true);
        } catch {
          // If profile fetch fails, token might be expired
          // Try to refresh if we have refresh token and keep logged in is enabled
          if (refreshToken && keepLoggedIn === 'true') {
            try {
              await refreshAuthToken(refreshToken);
              // refreshAuthToken will set isAuthenticated if successful
            } catch {
              // Refresh also failed, logout
              await logout();
            }
          } else {
            // No refresh token or keep logged in not enabled, logout
            await logout();
          }
        }
      } else if (refreshToken && keepLoggedIn === 'true') {
        // No access token but we have refresh token and keep logged in is enabled
        // Try to refresh the token
        try {
          await refreshAuthToken(refreshToken);
          // refreshAuthToken will set isAuthenticated if successful
        } catch {
          // Refresh failed, logout
          await logout();
        }
      } else {
        // No tokens or keep logged in not enabled
        setIsAuthenticated(false);
        setUserId(null);
        setUser(null);
        setOnboardingComplete(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
      setUserId(null);
      setUser(null);
      setOnboardingComplete(false);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile, refreshAuthToken, logout]);

  const login = async (tokens: {
    access: string;
    refresh: string;
    userId: string;
    onboardingComplete?: boolean;
  }) => {
    await SecureStore.setItemAsync('access_token', tokens.access);
    await SecureStore.setItemAsync('refresh_token', tokens.refresh);
    await SecureStore.setItemAsync('user_id', tokens.userId);
    setUserId(tokens.userId);
    // Set onboarding status immediately if provided (from login response)
    if (tokens.onboardingComplete !== undefined) {
      setOnboardingComplete(tokens.onboardingComplete);
    }
    // Fetch user profile after login to get full user data
    try {
      await fetchUserProfile();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user profile after login:', error);
      // Profile fetch failed, but login succeeded
      // Set authenticated anyway since we have valid tokens from login
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listen for logout events from API client (e.g., on 401 errors)
  useEffect(() => {
    const unsubscribe = authEvents.onLogout(() => {
      logout();
    });

    return unsubscribe;
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        userId,
        onboardingComplete,
        login,
        logout,
        checkAuth,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
