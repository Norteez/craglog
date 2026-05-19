import { prisma } from '../../config/prisma';
import { LocationType } from '@prisma/client';

export async function getSessions(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [sessions, total] = await Promise.all([
    prisma.session.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      skip,
      take: limit,
      include: { _count: { select: { routes: true } } },
    }),
    prisma.session.count({ where: { userId } }),
  ]);
  return { sessions, total, page, pages: Math.ceil(total / limit) };
}

export async function getSession(id: string, userId: string) {
  const session = await prisma.session.findUnique({
    where: { id },
    include: { routes: { orderBy: { createdAt: 'asc' } } },
  });
  if (!session) throw Object.assign(new Error('Session not found'), { statusCode: 404 });
  if (session.userId !== userId) throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
  return session;
}

export async function createSession(
  userId: string,
  data: { date: Date; location: string; locationType: LocationType; notes?: string }
) {
  return prisma.session.create({ data: { userId, ...data }, include: { routes: true } });
}

export async function updateSession(
  id: string,
  userId: string,
  data: Partial<{ date: Date; location: string; locationType: LocationType; notes: string }>
) {
  await getSession(id, userId);
  return prisma.session.update({ where: { id }, data, include: { routes: true } });
}

export async function deleteSession(id: string, userId: string) {
  await getSession(id, userId);
  await prisma.session.delete({ where: { id } });
}
