import type { Request, Response } from 'express';
import { addComment } from '../repositories/mockData.ts';

export const addCommentHandler = (req: Request, res: Response) => {
  const { proposalId, content, replyTo } = req.body;
  const userId = req.user?.id;
  
  if (!userId || req.user?.type === 'visitor') {
    return res.status(401).json({
      success: false,
      message: '请先登录',
      data: null,
    });
  }
  
  if (!proposalId || !content) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数',
      data: null,
    });
  }
  
  const comment = addComment(proposalId, userId, content, replyTo);
  
  if (!comment) {
    return res.status(500).json({
      success: false,
      message: '评论失败',
      data: null,
    });
  }
  
  res.json({
    success: true,
    message: '评论成功',
    data: comment,
  });
};
