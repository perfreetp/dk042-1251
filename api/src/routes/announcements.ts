import { Router } from 'express';
import { getActiveAnnouncementsHandler } from '../controllers/announcementController.ts';

const router = Router();

router.get('/', getActiveAnnouncementsHandler);

export default router;
