import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as controller from './sessions.controller';
import routeRouter from '../routes/routes.routes';

const router = Router();

const createSchema = z.object({
  date: z.string().datetime(),
  location: z.string().min(1).max(100),
  locationType: z.enum(['GYM', 'OUTDOOR']),
  notes: z.string().max(1000).optional(),
});

const updateSchema = createSchema.partial();

router.use(requireAuth);

router.get('/', controller.list);
router.post('/', validate(createSchema), controller.create);
router.get('/:id', controller.get);
router.patch('/:id', validate(updateSchema), controller.update);
router.delete('/:id', controller.remove);

router.use('/:sessionId/routes', routeRouter);

export default router;
