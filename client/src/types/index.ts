export type GradeSystem = 'YOSEMITE' | 'V_SCALE' | 'FRENCH';
export type ClimbStyle = 'SPORT' | 'TRAD' | 'BOULDER' | 'TOP_ROPE';
export type LocationType = 'GYM' | 'OUTDOOR';

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface Route {
  id: string;
  sessionId: string;
  name?: string;
  grade: string;
  gradeSystem: GradeSystem;
  style: ClimbStyle;
  attempts: number;
  completed: boolean;
  notes?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  date: string;
  location: string;
  locationType: LocationType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  routes: Route[];
  _count?: { routes: number };
}

export interface SessionsPage {
  sessions: Session[];
  total: number;
  page: number;
  pages: number;
}

export interface StatsSummary {
  totalSessions: number;
  totalRoutes: number;
  successRate: number;
  hardestSend: { grade: string; system: GradeSystem } | null;
}

export interface GradeOverTime {
  week: string;
  routes: { grade: string; gradeSystem: GradeSystem }[];
}

export interface VolumePoint {
  week: string;
  count: number;
}

export interface SuccessRatePoint {
  grade: string;
  gradeSystem: GradeSystem;
  total: number;
  completed: number;
  successRate: number;
}
