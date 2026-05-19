import { prisma } from '../../config/prisma';
import { GradeSystem, ClimbStyle } from '@prisma/client';

async function assertSessionOwnership(sessionId: string, userId: string) {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) throw Object.assign(new Error('Session not found'), { statusCode: 404 });
  if (session.userId !== userId) throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
}

export async function addRoute(
  sessionId: string,
  userId: string,
  data: {
    grade: string;
    gradeSystem: GradeSystem;
    style: ClimbStyle;
    name?: string;
    attempts?: number;
    completed?: boolean;
    notes?: string;
  }
) {
  await assertSessionOwnership(sessionId, userId);
  return prisma.route.create({ data: { sessionId, ...data } });
}

export async function updateRoute(
  routeId: string,
  sessionId: string,
  userId: string,
  data: Partial<{
    grade: string;
    gradeSystem: GradeSystem;
    style: ClimbStyle;
    name: string;
    attempts: number;
    completed: boolean;
    notes: string;
  }>
) {
  await assertSessionOwnership(sessionId, userId);
  const route = await prisma.route.findUnique({ where: { id: routeId } });
  if (!route || route.sessionId !== sessionId) {
    throw Object.assign(new Error('Route not found'), { statusCode: 404 });
  }
  return prisma.route.update({ where: { id: routeId }, data });
}

export async function deleteRoute(routeId: string, sessionId: string, userId: string) {
  await assertSessionOwnership(sessionId, userId);
  const route = await prisma.route.findUnique({ where: { id: routeId } });
  if (!route || route.sessionId !== sessionId) {
    throw Object.assign(new Error('Route not found'), { statusCode: 404 });
  }
  await prisma.route.delete({ where: { id: routeId } });
}
