import { api } from './axiosClient';
import { Session, SessionsPage, Route } from '../types';

export const sessionsApi = {
  list: (page = 1, limit = 20) =>
    api.get<SessionsPage>('/api/sessions', { params: { page, limit } }),

  get: (id: string) =>
    api.get<{ session: Session }>(`/api/sessions/${id}`),

  create: (data: { date: string; location: string; locationType: string; notes?: string }) =>
    api.post<{ session: Session }>('/api/sessions', data),

  update: (id: string, data: Partial<{ date: string; location: string; locationType: string; notes: string }>) =>
    api.patch<{ session: Session }>(`/api/sessions/${id}`, data),

  delete: (id: string) =>
    api.delete(`/api/sessions/${id}`),

  addRoute: (sessionId: string, data: Omit<Route, 'id' | 'sessionId' | 'createdAt'>) =>
    api.post<{ route: Route }>(`/api/sessions/${sessionId}/routes`, data),

  updateRoute: (sessionId: string, routeId: string, data: Partial<Route>) =>
    api.patch<{ route: Route }>(`/api/sessions/${sessionId}/routes/${routeId}`, data),

  deleteRoute: (sessionId: string, routeId: string) =>
    api.delete(`/api/sessions/${sessionId}/routes/${routeId}`),
};
