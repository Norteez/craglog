import { Request, Response, NextFunction } from 'express';
import * as service from './stats.service';

export async function summary(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getSummary(req.user.userId);
    res.json(data);
  } catch (err) { next(err); }
}

export async function gradesOverTime(req: Request, res: Response, next: NextFunction) {
  try {
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;
    const data = await service.getGradesOverTime(req.user.userId, from, to);
    res.json(data);
  } catch (err) { next(err); }
}

export async function volume(req: Request, res: Response, next: NextFunction) {
  try {
    const weeks = Number(req.query.weeks) || 12;
    const data = await service.getVolume(req.user.userId, weeks);
    res.json(data);
  } catch (err) { next(err); }
}

export async function successRate(req: Request, res: Response, next: NextFunction) {
  try {
    const style = req.query.style as string | undefined;
    const data = await service.getSuccessRateByGrade(req.user.userId, style);
    res.json(data);
  } catch (err) { next(err); }
}
