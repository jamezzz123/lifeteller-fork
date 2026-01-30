import { z } from 'zod';
import { apiClient } from './client';
import { API_ROUTES } from './routes';
import {
  LoginRequestSchema,
  LoginResponseSchema,
  RefreshTokenRequestSchema,
  RefreshTokenResponseSchema,
  RegisterRequestSchema,
  RegisterResponseSchema,
  OtpVerifyRequestSchema,
  OtpVerifyResponseSchema,
  OtpResendRequestSchema,
  OtpResendResponseSchema,
  CheckUsernameRequestSchema,
  CheckUsernameResponseSchema,
  UsernameSuggestionsRequestSchema,
  UsernameSuggestionsResponseSchema,
  ApiErrorSchema,
  UserProfileResponseSchema,
  UpdateProfileRequestSchema,
  UpdateProfileResponseSchema,
  UploadAvatarResponseSchema,
  InterestsListResponseSchema,
  RaiseLiftRequestSchema,
  RaiseLiftResponseSchema,
  type LoginRequest,
  type LoginResponse,
  type RefreshTokenRequest,
  type RefreshTokenResponse,
  type RegisterRequest,
  type RegisterResponse,
  type OtpVerifyRequest,
  type OtpVerifyResponse,
  type OtpResendRequest,
  type OtpResendResponse,
  type CheckUsernameRequest,
  type CheckUsernameResponse,
  type UsernameSuggestionsRequest,
  type UsernameSuggestionsResponse,
  type UserProfileResponse,
  type UpdateProfileRequest,
  type UpdateProfileResponse,
  type UploadAvatarResponse,
  type InterestsListResponse,
  type RaiseLiftRequest,
  type RaiseLiftResponse,
} from './schemas';

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    try {
      const validatedPayload = LoginRequestSchema.parse(payload);
      console.log('Login request payload:', validatedPayload);
      const data = await apiClient.post<LoginResponse>(
        API_ROUTES.auth.login,
        validatedPayload
      );

      return LoginResponseSchema.parse(data);
    } catch (error: any) {
      throw error;
    }
  },

  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    console.log('authApi.register called with payload:', payload);
    
    // Clean up payload: remove empty strings for optional fields
    const cleanedPayload = {
      ...payload,
      email: payload.email && payload.email.trim() ? payload.email.trim() : undefined,
      phone_number: payload.phone_number && payload.phone_number.trim() ? payload.phone_number.trim() : undefined,
      country_iso3: payload.country_iso3 && payload.country_iso3.trim() ? payload.country_iso3.trim() : undefined,
    };
    
    try {
      const validatedPayload = RegisterRequestSchema.parse(cleanedPayload);
      console.log('authApi.register making API call...');
      const data = await apiClient.post<RegisterResponse>(
        API_ROUTES.auth.register,
        validatedPayload
      );
      console.log('authApi.register API call completed:', data);
      return RegisterResponseSchema.parse(data);
    } catch (error: any) {
      // Provide better error messages for validation errors
      if (error?.name === 'ZodError' && error?.issues) {
        const errorMessages = error.issues.map((err: any) => {
          const path = err.path?.join('.') || 'unknown';
          return `${path}: ${err.message || 'Validation failed'}`;
        }).join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
      // If it's a ZodError but doesn't have issues, throw the original error
      if (error?.name === 'ZodError') {
        throw error;
      }
      throw error;
    }
  },

  verifyOtp: async (payload: OtpVerifyRequest): Promise<OtpVerifyResponse> => {
    const validatedPayload = OtpVerifyRequestSchema.parse(payload);
    const data = await apiClient.post<OtpVerifyResponse>(
      API_ROUTES.auth.otpVerify,
      validatedPayload
    );
    return OtpVerifyResponseSchema.parse(data);
  },

  resendOtp: async (payload: OtpResendRequest): Promise<OtpResendResponse> => {
    const validatedPayload = OtpResendRequestSchema.parse(payload);
    const data = await apiClient.post<OtpResendResponse>(
      API_ROUTES.auth.otpResend,
      validatedPayload
    );
    return OtpResendResponseSchema.parse(data);
  },

  checkUsername: async (
    payload: CheckUsernameRequest
  ): Promise<CheckUsernameResponse> => {
    const validatedPayload = CheckUsernameRequestSchema.parse(payload);
    const data = await apiClient.post<CheckUsernameResponse>(
      API_ROUTES.auth.checkUsername,
      validatedPayload
    );
    console.log('Username check API response:', data);

    // Use safeParse to handle validation errors gracefully
    const parsed = CheckUsernameResponseSchema.safeParse(data);

    if (!parsed.success) {
      console.warn('Username check response validation failed:', parsed.error);
      // Return a valid structure even if validation fails
      return {
        success: true as const,
        message: data.message || 'Username check completed',
        data: {
          username: data.data?.username || payload.username,
          is_available: data.data?.is_available ?? false,
          message: data.data?.message || '',
        },
        onboarding_complete: data.onboarding_complete ?? null,
      };
    }

    console.log('Username check parsed response:', parsed.data);
    return parsed.data;
  },

  usernameSuggestions: async (
    payload: UsernameSuggestionsRequest
  ): Promise<UsernameSuggestionsResponse> => {
    const validatedPayload = UsernameSuggestionsRequestSchema.parse(payload);
    const data = await apiClient.get<UsernameSuggestionsResponse>(
      API_ROUTES.auth.usernameSuggestions,
      {
        params: { username: validatedPayload.username },
      }
    );

    return UsernameSuggestionsResponseSchema.parse(data);
  },

  refreshToken: async (
    payload: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> => {
    const validatedPayload = RefreshTokenRequestSchema.parse(payload);
    const data = await apiClient.post<RefreshTokenResponse>(
      API_ROUTES.auth.refreshToken,
      validatedPayload
    );
    return RefreshTokenResponseSchema.parse(data);
  },
};

export const userApi = {
  getProfile: async (): Promise<UserProfileResponse> => {
    const data = await apiClient.get<UserProfileResponse>(
      API_ROUTES.users.profile
    );
    return UserProfileResponseSchema.parse(data);
  },

  updateProfile: async (
    payload: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> => {
    const validatedPayload = UpdateProfileRequestSchema.parse(payload);

    try {
      const response = await apiClient.patch<any>(
        API_ROUTES.users.profile,
        validatedPayload
      );

      // Validate and parse response
      const parsed = UpdateProfileResponseSchema.safeParse(response);

      if (!parsed.success) {
        // Return a valid structure even if validation fails
        return {
          success: true as const,
          message: response.message || 'Profile updated successfully',
          data: response.data || ({} as any),
          onboarding_complete: response.onboarding_complete ?? true,
        };
      }

      return parsed.data;
    } catch (error: any) {
      // Re-throw with more context
      throw error;
    }
  },

  uploadAvatar: async (file: {
    uri: string;
    type: string;
    name: string;
  }): Promise<UploadAvatarResponse> => {
    // Create FormData for file upload (React Native compatible)
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'avatar.jpg',
    } as any);

    try {
      // Axios will automatically set Content-Type with boundary for FormData
      const response = await apiClient.post<any>(
        API_ROUTES.users.profileAvatar,
        formData
      );

      // Validate and parse response
      const parsed = UploadAvatarResponseSchema.safeParse(response);

      if (!parsed.success) {
        // Return a valid structure even if validation fails
        return {
          success: true as const,
          message: response.message || 'Avatar uploaded successfully',
          data: response.data || {},
          onboarding_complete: response.onboarding_complete ?? true,
        };
      }

      return parsed.data;
    } catch (error: any) {
      // Re-throw with more context
      throw error;
    }
  },

  getInterests: async (): Promise<InterestsListResponse> => {
    const data = await apiClient.get<InterestsListResponse>(
      `${API_ROUTES.users.interests}?page=1&per_page=50`
    );
    return InterestsListResponseSchema.parse(data);
  },
};

export const liftsApi = {
  raise: async (payload: RaiseLiftRequest): Promise<RaiseLiftResponse> => {
    const validatedPayload = RaiseLiftRequestSchema.parse(payload);

    try {
      const response = await apiClient.post<any>(
        API_ROUTES.lifts.raise,
        validatedPayload
      );

      const parsed = RaiseLiftResponseSchema.safeParse(response);

      if (!parsed.success) {
        console.warn(
          'Raise lift response validation failed:',
          parsed.error.issues
        );
        return {
          message: response.message || 'Lift raised successfully',
          data: response.data,
          success: response.success ?? true,
          onboarding_complete: response.onboarding_complete,
        };
      }

      return parsed.data;
    } catch (error: any) {
      if (error?.name === 'ZodError' && error?.issues) {
        const errorMessages = error.issues
          .map((err: any) => {
            const path = err.path?.join('.') || 'unknown';
            return `${path}: ${err.message || 'Validation failed'}`;
          })
          .join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
      throw error;
    }
  },
};

// Export error type for error handling
export type ApiError = z.infer<typeof ApiErrorSchema>;
