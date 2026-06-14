import { Router } from 'express';
import {
  loginHandler,
  getUsersHandler,
  getCurrentUserHandler,
} from '../controllers/userController.ts';

const router = Router();

router.post('/login', loginHandler);
router.get('/list', getUsersHandler);
router.get('/me', getCurrentUserHandler);

export default router;
