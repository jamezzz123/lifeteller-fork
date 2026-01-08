import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { appConfig } from '@/config/app.config';
import { authApi } from './endpoints';
import { authEvents } from '@/lib/utils/authEvents';

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  appConfig.api.baseUrl;

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: {
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private setupInterceptors() {
    // Request interceptor: Add auth token
    this.client.interceptors.request.use(
      async (config: any) => {
        const token = await SecureStore.getItemAsync('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // Don't set Content-Type for FormData - let axios handle it
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor: Handle errors globally
    this.client.interceptors.response.use(
      (response: any) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Log error response for debugging
        if (error.response) {
          console.log('API Error Response:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers,
            url: error.config?.url,
            method: error.config?.method,
            fullResponse: JSON.stringify(error.response, null, 2),
          });
        }

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
          // Check if this is a refresh token request to avoid infinite loop
          if (originalRequest?.url?.includes('/auth/token/refresh')) {
            // Refresh token request failed, logout user
            await SecureStore.deleteItemAsync('access_token');
            await SecureStore.deleteItemAsync('refresh_token');
            await SecureStore.deleteItemAsync('keep_logged_in');
            this.processQueue(error, null);
            // Emit logout event to trigger auth context logout
            authEvents.emitLogout();
            return Promise.reject(error);
          }

          // Only attempt refresh if we have an original request and haven't retried yet
          if (originalRequest && !originalRequest._retry) {
            // Check if we have a refresh token and keep logged in is enabled
            const refreshToken = await SecureStore.getItemAsync('refresh_token');
            const keepLoggedIn = await SecureStore.getItemAsync('keep_logged_in');

            if (refreshToken && keepLoggedIn === 'true') {
              // Mark request as retried to avoid infinite loops
              originalRequest._retry = true;

              if (this.isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                  this.failedQueue.push({ resolve, reject });
                })
                  .then((token) => {
                    if (originalRequest.headers) {
                      originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return this.client(originalRequest);
                  })
                  .catch((err) => {
                    return Promise.reject(err);
                  });
              }

              this.isRefreshing = true;

              try {
                // Attempt to refresh the token
                const response = await authApi.refreshToken({
                  refresh: refreshToken,
                });

                // Store new tokens
                await SecureStore.setItemAsync(
                  'access_token',
                  response.data.access
                );
                await SecureStore.setItemAsync(
                  'refresh_token',
                  response.data.refresh
                );

                // Update the authorization header for the original request
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                }

                // Process queued requests
                this.processQueue(null, response.data.access);
                this.isRefreshing = false;

                // Retry the original request
                return this.client(originalRequest);
              } catch (refreshError) {
                // Refresh failed, logout user
                this.processQueue(refreshError, null);
                this.isRefreshing = false;
                await SecureStore.deleteItemAsync('access_token');
                await SecureStore.deleteItemAsync('refresh_token');
                await SecureStore.deleteItemAsync('keep_logged_in');
                // Emit logout event to trigger auth context logout
                authEvents.emitLogout();
                return Promise.reject(refreshError);
              }
            }
          }

          // No refresh token, keep logged in not enabled, or already retried
          // Clear tokens and logout user
          await SecureStore.deleteItemAsync('access_token');
          await SecureStore.deleteItemAsync('refresh_token');
          await SecureStore.deleteItemAsync('keep_logged_in');
          // Emit logout event to trigger auth context logout
          authEvents.emitLogout();
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
