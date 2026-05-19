import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import * as controller from './stats.controller';

const router = Router();
router.use(requireAuth);

router.get('/summary', controller.summary);
router.get('/grades-over-time', controller.gradesOverTime);
router.get('/volume', controller.volume);
router.get('/success-rate', controller.successRate);

export default router;
