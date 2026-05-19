import { Request, Response, NextFunction } from 'express';
import * as service from './sessions.service';
import { LocationType } from '@prisma/client';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await service.getSessions(req.user.userId, page, limit);
    res.json(result);
  } catch (err) { next(err); }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await service.getSession(req.params.id as string, req.user.userId);
    res.json({ session });
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { date, location, locationType, notes } = req.body;
    const session = await service.createSession(req.user.userId, {
      date: new Date(date),
      location,
      locationType: locationType as LocationType,
      notes,
    });
    res.status(201).json({ session });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { date, location, locationType, notes } = req.body;
    const session = await service.updateSession(req.params.id as string, req.user.userId, {
      ...(date && { date: new Date(date) }),
      ...(location && { location }),
      ...(locationType && { locationType: locationType as LocationType }),
      ...(notes !== undefined && { notes }),
    });
    res.json({ session });
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteSession(req.params.id as string, req.user.userId);
    res.status(204).send();
  } catch (err) { next(err); }
}
