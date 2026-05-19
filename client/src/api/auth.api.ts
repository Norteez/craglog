import { api } from './axiosClient';
import { User } from '../types';

export const authApi = {
  register: (email: string, username: string, password: string) =>
    api.post<{ accessToken: string; user: User }>('/api/auth/register', { email, username, password }),

  login: (email: string, password: string) =>
    api.post<{ accessToken: string; user: User }>('/api/auth/login', { email, password }),

  refresh: () =>
    api.post<{ accessToken: string }>('/api/auth/refresh'),

  logout: () =>
    api.post('/api/auth/logout'),

  me: () =>
    api.get<{ user: User }>('/api/auth/me'),
};
