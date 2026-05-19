import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.middleware';
import * as controller from './routes.controller';

const router = Router({ mergeParams: true });

const createSchema = z.object({
  grade: z.string().min(1).max(10),
  gradeSystem: z.enum(['YOSEMITE', 'V_SCALE', 'FRENCH']),
  style: z.enum(['SPORT', 'TRAD', 'BOULDER', 'TOP_ROPE']),
  name: z.string().max(100).optional(),
  attempts: z.number().int().min(1).default(1),
  completed: z.boolean().default(false),
  notes: z.string().max(500).optional(),
});

const updateSchema = createSchema.partial();

router.post('/', validate(createSchema), controller.add);
router.patch('/:routeId', validate(updateSchema), controller.update);
router.delete('/:routeId', controller.remove);

export default router;
