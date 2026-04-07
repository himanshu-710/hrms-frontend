import axios from "axios";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  redirectToLogin,
  refreshStoredSession,
} from "@/features/auth/lib/authStorage";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
});


api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!getRefreshToken()) {
        clearAuthSession();
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        const session = await refreshStoredSession();

        if (!session) {
          clearAuthSession();
          redirectToLogin();
          return Promise.reject(error);
        }

        originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
        return api(originalRequest);
      } catch {
        clearAuthSession();
        redirectToLogin();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
