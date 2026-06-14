import type { Request, Response } from 'express';
import { getActiveAnnouncements } from '../repositories/mockData.ts';

export const getActiveAnnouncementsHandler = (_req: Request, res: Response) => {
  const announcements = getActiveAnnouncements();

  res.json({
    success: true,
    message: '获取成功',
    data: announcements,
  });
};
