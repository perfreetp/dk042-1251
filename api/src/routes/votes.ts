import { Router } from 'express';
import {
  voteHandler,
  unvoteHandler,
  checkVoteHandler,
} from '../controllers/voteController.ts';
import { requireAuth } from '../middleware/auth.ts';

const router = Router();

router.post('/', requireAuth, voteHandler);
router.delete('/', requireAuth, unvoteHandler);
router.get('/:proposalId', checkVoteHandler);

export default router;
