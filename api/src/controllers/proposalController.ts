import type { Request, Response } from 'express';
import {
  getProposals,
  getProposalById,
  createProposal,
  hasVoted,
  isWatching,
} from '../repositories/mockData.ts';
import type { GetProposalsParams } from '../../../shared/index.ts';

export const getProposalsHandler = (req: Request, res: Response) => {
  const { status, sortBy, userType, page, limit } = req.query as GetProposalsParams;

  const result = getProposals({
    status: status as string,
    sortBy: sortBy as string,
    userType: userType as string,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  res.json({
    success: true,
    message: '获取成功',
    data: result,
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
