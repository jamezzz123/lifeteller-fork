import { z } from 'zod';

// API Response wrappers
export const ApiErrorSchema = z.object({
  error: z.string(),
  code: z.string(),
  success: z.literal(false),
  detail: z.string().optional(),
  message: z.string().optional(),
});

export const ApiSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
});

// Login schemas
export const LoginRequestSchema = z.object({
  login: z.string(),
  password: z.string(),
});

export const LoginDataSchema = z.object({
  access: z.string(),
  refresh: z.string(),
  user_id: z.string().uuid(),
  username: z.string(),
  avatar_url: z.string().nullable(),
  is_active: z.boolean(),
  is_email_verified: z.boolean(),
  is_phone_verified: z.boolean(),
});

export const LoginResponseSchema = ApiSuccessSchema.extend({
  data: LoginDataSchema,
  onboarding_complete: z.boolean(),
});

// Refresh token schemas
export const RefreshTokenRequestSchema = z.object({
  refresh: z.string(),
});

export const RefreshTokenDataSchema = z.object({
  access: z.string(),
  refresh: z.string(),
  user_id: z.string().uuid(),
  username: z.string(),
  avatar_url: z.string().nullable(),
  is_active: z.boolean(),
  is_email_verified: z.boolean(),
  is_phone_verified: z.boolean(),
});

export const RefreshTokenResponseSchema = ApiSuccessSchema.extend({
  data: RefreshTokenDataSchema,
  onboarding_complete: z.boolean(),
});

// Registration schemas
export const RegisterRequestSchema = z.object({
  username: z.string(),
  email: z.string().email().optional(),
  phone_number: z.string().optional(),
  password: z.string().min(8),
});

export const RegisterDataSchema = z.object({
  access: z.string(),
  refresh: z.string(),
  user_id: z.string().uuid(),
  username: z.string(),
  avatar_url: z.string().nullable(),
  is_active: z.boolean(),
  is_email_verified: z.boolean(),
  is_phone_verified: z.boolean(),
});

export const RegisterResponseSchema = ApiSuccessSchema.extend({
  data: RegisterDataSchema,
  onboarding_complete: z.boolean().nullable().optional(),
});

// Username check schemas
export const CheckUsernameRequestSchema = z.object({
  username: z.string(),
});

export const CheckUsernameDataSchema = z.object({
  username: z.string(),
  is_available: z.boolean(),
  message: z.string(),
});

export const CheckUsernameResponseSchema = ApiSuccessSchema.extend({
  data: CheckUsernameDataSchema,
  onboarding_complete: z.boolean().nullable().optional(),
});

// User schemas
export const InterestSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  icon: z.string().nullable(),
});

export const UserProfileDataSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  username: z.string(),
  email: z.string().nullable(),
  phone_number: z.string().nullable(),
  bio: z.string().nullable(),
  interests: z.array(InterestSchema),
  avatar_url: z.string().nullable(),
  is_active: z.boolean(),
  is_email_verified: z.boolean(),
  is_phone_verified: z.boolean(),
});

export const UserProfileResponseSchema = ApiSuccessSchema.extend({
  data: UserProfileDataSchema,
  onboarding_complete: z.boolean().nullable().optional(),
});

// Profile update schemas
export const UpdateProfileRequestSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  bio: z.string().optional(),
  interests: z.array(z.string().uuid()).optional(),
});

export const UpdateProfileResponseSchema = ApiSuccessSchema.extend({
  data: UserProfileDataSchema, // Full user profile data
  onboarding_complete: z.boolean().nullable().optional(),
});

// Avatar upload response schema
export const UploadAvatarResponseSchema = ApiSuccessSchema.extend({
  data: z.record(z.string(), z.unknown()).optional(), // additionalProp1: {} - make optional and more lenient
  onboarding_complete: z.boolean().optional(), // Make optional in case API doesn't return it
});

// Interests list schemas
export const InterestsListDataSchema = z.object({
  count: z.number(),
  total_pages: z.number(),
  current_page: z.number(),
  per_page: z.number(),
  results: z.array(InterestSchema),
});

export const InterestsListResponseSchema = ApiSuccessSchema.extend({
  data: InterestsListDataSchema,
  onboarding_complete: z.boolean().nullable(),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  handle: z.string().optional(),
  email: z.string().email().optional(),
  profileImage: z.string().url().nullable(),
  avatar_url: z.string().url().nullable(),
  bio: z.string().optional(),
  followersCount: z.number().optional(),
  followingCount: z.number().optional(),
  liftsCount: z.number().optional(),
  isVerified: z.boolean().default(false),
  is_active: z.boolean().optional(),
  is_email_verified: z.boolean().optional(),
  is_phone_verified: z.boolean().optional(),
  createdAt: z.string().datetime().optional(),
});

// Infer TypeScript types from schemas
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginData = z.infer<typeof LoginDataSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type RefreshTokenData = z.infer<typeof RefreshTokenDataSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RegisterData = z.infer<typeof RegisterDataSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type CheckUsernameRequest = z.infer<typeof CheckUsernameRequestSchema>;
export type CheckUsernameData = z.infer<typeof CheckUsernameDataSchema>;
export type CheckUsernameResponse = z.infer<typeof CheckUsernameResponseSchema>;
export type Interest = z.infer<typeof InterestSchema>;
export type UserProfileData = z.infer<typeof UserProfileDataSchema>;
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;
export type UploadAvatarResponse = z.infer<typeof UploadAvatarResponseSchema>;
export type InterestsListResponse = z.infer<typeof InterestsListResponseSchema>;
export type User = z.infer<typeof UserSchema>;
