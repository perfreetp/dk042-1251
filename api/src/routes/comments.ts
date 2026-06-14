import { Router } from 'express';
import { addCommentHandler } from '../controllers/commentController.ts';
import { requireAuth } from '../middleware/auth.ts';

const router = Router();

router.post('/', requireAuth, addCommentHandler);

export default router;
