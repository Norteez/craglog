import { prisma } from '../../config/prisma';
import { harderGradeCrossSystem, GradeSystem } from '../../utils/gradeUtils';

export async function getSummary(userId: string) {
  const [totalSessions, routes] = await Promise.all([
    prisma.session.count({ where: { userId } }),
    prisma.route.findMany({
      where: { session: { userId } },
      select: { grade: true, gradeSystem: true, completed: true },
    }),
  ]);

  const totalRoutes = routes.length;
  const completed = routes.filter((r) => r.completed);
  const successRate = totalRoutes > 0 ? Math.round((completed.length / totalRoutes) * 100) : 0;

  const hardestSend = completed.reduce<{ grade: string; system: GradeSystem } | null>(
    (best, route) => {
      const current = { grade: route.grade, system: route.gradeSystem as GradeSystem };
      if (!best) return current;
      return harderGradeCrossSystem(best, current) ?? best;
    },
    null
  );

  return { totalSessions, totalRoutes, successRate, hardestSend };
}

export async function getGradesOverTime(userId: string, from?: Date, to?: Date) {
  const routes = await prisma.route.findMany({
    where: {
      session: {
        userId,
        ...(from || to ? { date: { ...(from && { gte: from }), ...(to && { lte: to }) } } : {}),
      },
      completed: true,
    },
    select: { grade: true, gradeSystem: true, session: { select: { date: true } } },
    orderBy: { session: { date: 'asc' } },
  });

  // Group into ISO week buckets: "2026-W20"
  const buckets: Record<string, { grade: string; gradeSystem: string }[]> = {};
  for (const route of routes) {
    const week = getISOWeekKey(route.session.date);
    if (!buckets[week]) buckets[week] = [];
    buckets[week].push({ grade: route.grade, gradeSystem: route.gradeSystem });
  }

  return Object.entries(buckets).map(([week, weekRoutes]) => ({ week, routes: weekRoutes }));
}

export async function getVolume(userId: string, weeks = 12) {
  const from = new Date();
  from.setDate(from.getDate() - weeks * 7);

  const sessions = await prisma.session.findMany({
    where: { userId, date: { gte: from } },
    select: { date: true },
  });

  const buckets: Record<string, number> = {};
  for (const session of sessions) {
    const week = getISOWeekKey(session.date);
    buckets[week] = (buckets[week] ?? 0) + 1;
  }

  return Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, count]) => ({ week, count }));
}

export async function getSuccessRateByGrade(userId: string, style?: string) {
  const routes = await prisma.route.findMany({
    where: {
      session: { userId },
      ...(style && { style: style as never }),
    },
    select: { grade: true, gradeSystem: true, completed: true },
  });

  const map: Record<string, { total: number; completed: number }> = {};
  for (const route of routes) {
    const key = `${route.gradeSystem}:${route.grade}`;
    if (!map[key]) map[key] = { total: 0, completed: 0 };
    map[key].total++;
    if (route.completed) map[key].completed++;
  }

  return Object.entries(map).map(([key, { total, completed }]) => {
    const [gradeSystem, grade] = key.split(':');
    return { grade, gradeSystem, total, completed, successRate: Math.round((completed / total) * 100) };
  });
}

function getISOWeekKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}
