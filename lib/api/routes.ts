/**
 * API Routes Constants
 * Centralized location for all API endpoint paths
 * Add routes here as you implement them
 */

export const API_ROUTES = {
  // Authentication endpoints
  auth: {
    login: '/api/v1/users/login',
    register: '/api/v1/users/register',
    checkUsername: '/api/v1/users/check-username',
    refreshToken: '/api/v1/users/auth/token/refresh',
    // Add more auth routes as needed:
    // logout: '/api/v1/users/logout',
  },
  // User endpoints
  users: {
    profile: '/api/v1/users/profile',
    profileAvatar: '/api/v1/users/profile/avatar',
    interests: '/api/v1/users/interests',
  },
} as const;
