import { z } from 'zod';

// API Response wrappers
export const ApiErrorSchema = z.object({
  error: z.string(),
  code: z.string().nullable().optional(),
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
  country_iso3: z.string().optional(),
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

// OTP verification schemas
export const OtpVerifyRequestSchema = z.object({
  otp: z.string(),
});

export const OtpVerifyResponseSchema = ApiSuccessSchema.extend({
  data: z.null(),
  onboarding_complete: z.boolean().nullable().optional(),
});

// OTP resend schemas
export const OtpResendRequestSchema = z.object({
  channel: z.enum(['sms', 'email']),
});

export const OtpResendDataSchema = z.object({
  token_time: z.number(),
});

export const OtpResendResponseSchema = ApiSuccessSchema.extend({
  data: OtpResendDataSchema,
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

// Username suggestions schemas
export const UsernameSuggestionsRequestSchema = z.object({
  username: z.string(),
});

export const UsernameSuggestionsDataSchema = z.object({
  suggestions: z.array(z.string()),
});

export const UsernameSuggestionsResponseSchema = ApiSuccessSchema.extend({
  data: UsernameSuggestionsDataSchema,
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

// ── Lift schemas ─────────────────────────────────────────────

export const RaiseLiftRequestSchema = z.object({
  title: z.string(),
  description: z.string(),
  lift_category: z.enum(['MONETARY', 'NON_MONETARY']),
  general_category_id: z.string().uuid().optional(),
  is_hybrid: z.boolean().default(false),
  visibility: z.enum(['PUBLIC', 'FRIENDS', 'PRIVATE']),
  visibility_metadata: z.record(z.string(), z.unknown()).optional(),
  group_id: z.string().uuid().optional(),
  currency: z.string().default('NGN'),
  lift_amount: z.number().default(0),
  auto_debit: z.boolean().default(false),
  items_metadata: z.record(z.string(), z.unknown()).optional(),
  location_name: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  start_datetime: z.string().optional(),
  end_datetime: z.string().optional(),
  should_allow_collaborator: z.boolean().default(false),
  allowed_collaborators: z.number().default(0),
  collaborators: z.array(z.string().uuid()).default([]),
  should_allow_requester: z.boolean().default(false),
  allowed_requesters: z.number().default(0),
  is_anonymous: z.boolean().default(false),
  media: z.array(z.string()).default([]),
});

export const LiftAuthorSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  avatar: z.string().nullable(),
  following_since: z.string().nullable().optional(),
});

export const LiftGeneralCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  icon: z.string().nullable(),
  parent_name: z.string().nullable(),
});

export const LiftMediaSchema = z.object({
  id: z.string().uuid(),
  file: z.string(),
  media_type: z.string(),
  caption: z.string().nullable().optional(),
  order: z.number(),
});

export const LiftCollaboratorSchema = z.object({
  user_id: z.string().uuid(),
  username: z.string(),
  avatar_url: z.string().nullable(),
  role: z.string(),
  is_accepted: z.boolean(),
});

export const LiftDataSchema = z.object({
  id: z.string().uuid(),
  is_hybrid: z.boolean(),
  author_id: z.string().uuid(),
  author: LiftAuthorSchema,
  title: z.string(),
  description: z.string(),
  tags: z.union([z.string(), z.array(z.string())]).nullable().optional(),
  lift_type: z.string(),
  lift_category: z.string(),
  general_category: LiftGeneralCategorySchema.nullable().optional(),
  status: z.string(),
  visibility: z.string(),
  visibility_metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  target_amount: z.string().nullable().optional(),
  current_amount: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  items_metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  location_name: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  likes_count: z.number().default(0),
  shares_count: z.number().default(0),
  comments_count: z.number().default(0),
  views_count: z.number().default(0),
  contributors_count: z.number().default(0),
  interaction_count: z.number().default(0),
  is_anonymous: z.boolean(),
  start_datetime: z.string().nullable().optional(),
  end_datetime: z.string().nullable().optional(),
  created_at: z.string(),
  should_allow_collaborator: z.boolean().default(false),
  allowed_collaborators: z.number().default(0),
  should_allow_requester: z.boolean().default(false),
  allowed_requesters: z.number().default(0),
  collaborators: z.array(LiftCollaboratorSchema).default([]),
  media: z.array(LiftMediaSchema).default([]),
  is_liked_by_me: z.boolean().default(false),
  parent_lift: z.unknown().nullable().optional(),
  is_quote_repost: z.boolean().default(false),
});

export const RaiseLiftResponseSchema = z.object({
  message: z.string(),
  data: LiftDataSchema,
  success: z.boolean(),
  onboarding_complete: z.boolean().nullable().default(true),
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
export type OtpVerifyRequest = z.infer<typeof OtpVerifyRequestSchema>;
export type OtpVerifyResponse = z.infer<typeof OtpVerifyResponseSchema>;
export type OtpResendRequest = z.infer<typeof OtpResendRequestSchema>;
export type OtpResendResponse = z.infer<typeof OtpResendResponseSchema>;
export type CheckUsernameRequest = z.infer<typeof CheckUsernameRequestSchema>;
export type CheckUsernameData = z.infer<typeof CheckUsernameDataSchema>;
export type CheckUsernameResponse = z.infer<typeof CheckUsernameResponseSchema>;
export type UsernameSuggestionsRequest = z.infer<
  typeof UsernameSuggestionsRequestSchema
>;
export type UsernameSuggestionsData = z.infer<
  typeof UsernameSuggestionsDataSchema
>;
export type UsernameSuggestionsResponse = z.infer<
  typeof UsernameSuggestionsResponseSchema
>;
export type Interest = z.infer<typeof InterestSchema>;
export type UserProfileData = z.infer<typeof UserProfileDataSchema>;
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;
export type UploadAvatarResponse = z.infer<typeof UploadAvatarResponseSchema>;
export type InterestsListResponse = z.infer<typeof InterestsListResponseSchema>;
export type User = z.infer<typeof UserSchema>;
export type RaiseLiftRequest = z.infer<typeof RaiseLiftRequestSchema>;
export type RaiseLiftResponse = z.infer<typeof RaiseLiftResponseSchema>;
export type LiftData = z.infer<typeof LiftDataSchema>;
export type LiftAuthor = z.infer<typeof LiftAuthorSchema>;
export type LiftMedia = z.infer<typeof LiftMediaSchema>;
export type LiftCollaborator = z.infer<typeof LiftCollaboratorSchema>;
