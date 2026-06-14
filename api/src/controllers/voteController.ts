import type { Request, Response } from 'express';
import { addVote, removeVote, hasVoted } from '../repositories/mockData.ts';

export const voteHandler = (req: Request, res: Response) => {
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
  
  const vote = addVote(proposalId, userId);
  
  if (!vote) {
    return res.status(400).json({
      success: false,
      message: '您已投过票',
      data: null,
    });
  }
  
  res.json({
    success: true,
    message: '投票成功',
    data: vote,
  });
};

export const unvoteHandler = (req: Request, res: Response) => {
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
  
  const removed = removeVote(proposalId, userId);
  
  if (!removed) {
    return res.status(400).json({
      success: false,
      message: '您未投过票',
      data: null,
    });
  }
  
  res.json({
    success: true,
    message: '撤票成功',
    data: null,
  });
};

export const checkVoteHandler = (req: Request, res: Response) => {
  const { proposalId } = req.params;
  const userId = req.user?.id;
  
  if (!userId || req.user?.type === 'visitor') {
    return res.json({
      success: true,
      message: '访客未投票',
      data: { hasVoted: false },
    });
  }
  
  const voted = hasVoted(proposalId, userId);
  
  res.json({
    success: true,
    message: '获取成功',
    data: { hasVoted: voted },
  });
};
