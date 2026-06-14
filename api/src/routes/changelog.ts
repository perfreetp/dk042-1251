import { Router } from 'express';
import { getChangelogs } from '../repositories/mockData.ts';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: '获取成功',
    data: getChangelogs(),
  });
});

export default router;
