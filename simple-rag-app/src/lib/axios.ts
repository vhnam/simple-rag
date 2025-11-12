import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

class AuthInterceptor {
  private getTokenCallback: (() => Promise<string | null>) | null = null;

  /**
   * Set a callback function to retrieve the Auth0 access token
   * @param callback - Async function that returns the access token from Auth0
   */
  setTokenCallback(callback: () => Promise<string | null>) {
    this.getTokenCallback = callback;
  }

  /**
   * Axios request interceptor that adds Authorization header with Auth0 token
   */
  async intercept(config: InternalAxiosRequestConfig) {
    try {
      // Get token from Auth0 callback if available
      if (this.getTokenCallback) {
        const token = await this.getTokenCallback();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      // Silently fail if token retrieval fails (user might not be authenticated)
      console.debug('Failed to retrieve Auth0 token:', error);
    }
    return config;
  }
}

const authInterceptor = new AuthInterceptor();

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => authInterceptor.intercept(config),
  (error) => Promise.reject(error)
);

export { authInterceptor, apiClient };
