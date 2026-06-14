import { Router } from 'express';
import {
  getStatsHandler,
  updateStatusHandler,
  pinProposalHandler,
  mergeProposalsHandler,
  createCycleHandler,
  createChangelogHandler,
  getCyclesHandler,
  getAnnouncementsHandler,
  createAnnouncementHandler,
  updateAnnouncementHandler,
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

router.get('/announcements', requireMaintainer, getAnnouncementsHandler);
router.post('/announcement', requireMaintainer, createAnnouncementHandler);
router.patch('/announcement', requireMaintainer, updateAnnouncementHandler);

export default router;
