import type { Request, Response } from 'express';
import {
  getProposals,
  getProposalById,
  createProposal,
  hasVoted,
  isWatching,
} from '../repositories/mockData.ts';
import type { GetProposalsParams, ProposalStatus, SortBy } from '../../../shared/index.ts';

export const getProposalsHandler = (req: Request, res: Response) => {
  const { status, sortBy, userType, page = 1, limit = 20 } = req.query as GetProposalsParams;
  
  let proposals = getProposals();
  
  if (status) {
    proposals = proposals.filter(p => p.status === status);
  }
  
  if (sortBy === 'votes') {
    proposals = [...proposals].sort((a, b) => b.votes - a.votes);
  } else if (sortBy === 'recent') {
    proposals = [...proposals].sort((a, b) => b.recentVotes - a.recentVotes);
  } else if (sortBy === 'newest') {
    proposals = [...proposals].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  const pinned = proposals.filter(p => p.pinned);
  const unpinned = proposals.filter(p => !p.pinned);
  proposals = [...pinned, ...unpinned];
  
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  const paginated = proposals.slice(start, end);
  
  res.json({
    success: true,
    message: '获取成功',
    data: {
      proposals: paginated,
      total: proposals.length,
      page: pageNum,
      limit: limitNum,
    },
  });
};

export const getProposalHandler = (req: Request, res: Response) => {
  const { id } = req.params;
  const proposal = getProposalById(id);
  
  if (!proposal) {
    return res.status(404).json({
      success: false,
      message: '提案不存在',
      data: null,
    });
  }
  
  const userId = req.headers['x-user-id'] as string;
  const userHasVoted = userId ? hasVoted(id, userId) : false;
  const userIsWatching = userId ? isWatching(id, userId) : false;
  
  res.json({
    success: true,
    message: '获取成功',
    data: {
      ...proposal,
      hasVoted: userHasVoted,
      isWatching: userIsWatching,
    },
  });
};

export const createProposalHandler = (req: Request, res: Response) => {
  const { title, description, useCases, estimatedWork } = req.body;
  const userId = req.user?.id;
  
  if (!userId || req.user?.type === 'visitor') {
    return res.status(401).json({
      success: false,
      message: '请先登录',
      data: null,
    });
  }
  
  if (!title || !description || !useCases || !estimatedWork) {
    return res.status(400).json({
      success: false,
      message: '请填写完整信息',
      data: null,
    });
  }
  
  const proposal = createProposal({
    title,
    description,
    useCases: Array.isArray(useCases) ? useCases : [useCases],
    estimatedWork,
    authorId: userId,
  });
  
  if (!proposal) {
    return res.status(500).json({
      success: false,
      message: '创建失败',
      data: null,
    });
  }
  
  res.json({
    success: true,
    message: '提案提交成功，等待审核',
    data: proposal,
  });
};
