import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends httpOnly refresh cookie automatically
});

// Tracks whether a token refresh is already in flight.
// If multiple requests fail with 401 simultaneously, we only want ONE
// refresh call — the rest queue up and retry once it resolves.
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    const is401 = error.response?.status === 401;
    const isRefreshEndpoint = originalConfig?.url?.includes('/auth/refresh');
    const alreadyRetried = originalConfig?._retry;

    if (!is401 || isRefreshEndpoint || alreadyRetried) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Another refresh is in flight — queue this request until it resolves
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalConfig.headers['Authorization'] = `Bearer ${token}`;
        return api.request(originalConfig);
      });
    }

    originalConfig._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.post<{ accessToken: string }>('/api/auth/refresh');
      const { accessToken } = data;
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      originalConfig.headers['Authorization'] = `Bearer ${accessToken}`;
      processQueue(null, accessToken);
      return api.request(originalConfig);
    } catch (refreshError) {
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}
