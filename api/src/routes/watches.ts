import { Router } from 'express';
import {
  toggleWatchHandler,
  checkWatchHandler,
} from '../controllers/watchController.ts';
import { requireAuth } from '../middleware/auth.ts';

const router = Router();

router.post('/', requireAuth, toggleWatchHandler);
router.get('/:proposalId', checkWatchHandler);

export default router;
