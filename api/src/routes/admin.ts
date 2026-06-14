import { Router } from 'express';
import {
  getStatsHandler,
  updateStatusHandler,
  pinProposalHandler,
  mergeProposalsHandler,
  createCycleHandler,
  createChangelogHandler,
  getCyclesHandler,
} from '../controllers/adminController.ts';
import { requireMaintainer } from '../middleware/auth.ts';

const router = Router();

router.get('/stats', requireMaintainer, getStatsHandler);
router.patch('/proposal/status', requireMaintainer, updateStatusHandler);
router.patch('/proposal/pin', requireMaintainer, pinProposalHandler);
router.post('/proposal/merge', requireMaintainer, mergeProposalsHandler);
router.post('/cycle', requireMaintainer, createCycleHandler);
router.get('/cycles', requireMaintainer, getCyclesHandler);
router.post('/changelog', requireMaintainer, createChangelogHandler);

export default router;
