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

// TODO(human): Implement the Axios response interceptor below.
//
// What it needs to do:
// 1. If a response succeeds (no error), just return it.
// 2. If the error is NOT a 401, or the failing request was itself the
//    /auth/refresh endpoint (avoid infinite loop), reject immediately.
// 3. If another refresh is already in flight, queue this request:
//    push a promise onto failedQueue, and when it resolves replay the
//    original request with the new token in the Authorization header.
// 4. If no refresh is in flight:
//    a. Set isRefreshing = true
//    b. Call POST /api/auth/refresh (the cookie is sent automatically)
//    c. On success: store the new accessToken in the Authorization header
//       on the api instance default headers, call processQueue(null, token),
//       then replay the original failed request.
//    d. On failure: call processQueue(err, null), then reject.
//    e. Always set isRefreshing = false when done.
//
// Hints:
// - The original failed request config is in `error.config`
// - Set a _retry flag on config to avoid retrying more than once
// - axios.request(error.config) replays a request
// - The new token comes back as response.data.accessToken

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Your implementation here
    return Promise.reject(error);
  }
);

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}
