import { Router } from 'express';
import {
  getProposalsHandler,
  getProposalHandler,
  createProposalHandler,
} from '../controllers/proposalController.ts';
import { requireAuth } from '../middleware/auth.ts';

const router = Router();

router.get('/', getProposalsHandler);
router.get('/:id', getProposalHandler);
router.post('/', requireAuth, createProposalHandler);

export default router;
