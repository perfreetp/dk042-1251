import type { Request, Response } from 'express';
import { toggleWatch, isWatching } from '../repositories/mockData.ts';

export const toggleWatchHandler = (req: Request, res: Response) => {
  const { proposalId } = req.body;
  const userId = req.user?.id;
  
  if (!userId || req.user?.type === 'visitor') {
    return res.status(401).json({
      success: false,
      message: '请先登录',
      data: null,
    });
  }
  
  if (!proposalId) {
    return res.status(400).json({
      success: false,
      message: '缺少提案ID',
      data: null,
    });
  }
  
  const result = toggleWatch(proposalId, userId);
  
  res.json({
    success: true,
    message: result.watching ? '关注成功' : '取消关注成功',
    data: result,
  });
};

export const checkWatchHandler = (req: Request, res: Response) => {
  const { proposalId } = req.params;
  const userId = req.user?.id;
  
  if (!userId || req.user?.type === 'visitor') {
    return res.json({
      success: true,
      message: '访客未关注',
      data: { isWatching: false },
    });
  }
  
  const watching = isWatching(proposalId, userId);
  
  res.json({
    success: true,
    message: '获取成功',
    data: { isWatching: watching },
  });
};
