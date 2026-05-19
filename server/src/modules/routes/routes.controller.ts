import { Request, Response, NextFunction } from 'express';
import * as service from './routes.service';
import { GradeSystem, ClimbStyle } from '@prisma/client';

export async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.params.sessionId as string;
    const route = await service.addRoute(sessionId, req.user.userId, {
      ...req.body,
      gradeSystem: req.body.gradeSystem as GradeSystem,
      style: req.body.style as ClimbStyle,
    });
    res.status(201).json({ route });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.params.sessionId as string;
    const routeId = req.params.routeId as string;
    const route = await service.updateRoute(routeId, sessionId, req.user.userId, req.body);
    res.json({ route });
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.params.sessionId as string;
    const routeId = req.params.routeId as string;
    await service.deleteRoute(routeId, sessionId, req.user.userId);
    res.status(204).send();
  } catch (err) { next(err); }
}
