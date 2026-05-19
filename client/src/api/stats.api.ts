import { api } from './axiosClient';
import { StatsSummary, GradeOverTime, VolumePoint, SuccessRatePoint } from '../types';

export const statsApi = {
  summary: () =>
    api.get<StatsSummary>('/api/stats/summary'),

  gradesOverTime: (from?: string, to?: string) =>
    api.get<GradeOverTime[]>('/api/stats/grades-over-time', { params: { from, to } }),

  volume: (weeks = 12) =>
    api.get<VolumePoint[]>('/api/stats/volume', { params: { weeks } }),

  successRate: (style?: string) =>
    api.get<SuccessRatePoint[]>('/api/stats/success-rate', { params: { style } }),
};
