import type { Request, Response } from 'express';
import { getActiveAnnouncements } from '../repositories/mockData.ts';

export const getActiveAnnouncementsHandler = (req: Request, res: Response) => {
  const scope = req.query.scope as 'home' | 'proposal_detail' | undefined;
  const announcements = getActiveAnnouncements(scope);

  res.json({
    success: true,
    message: '获取成功',
    data: announcements,
  });
};
