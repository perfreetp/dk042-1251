import type { Request, Response } from 'express';
import {
  getProposals,
  getChangelogs,
  getVotingCycles,
  updateProposalStatus,
  pinProposal,
  mergeProposals,
  createVotingCycle,
  createChangelog,
} from '../repositories/mockData.ts';

export const getStatsHandler = (_req: Request, res: Response) => {
  const proposals = getProposals();
  const changelogs = getChangelogs();
  const cycles = getVotingCycles();
  
  const stats = {
    totalProposals: proposals.length,
    totalVotes: proposals.reduce((sum, p) => sum + p.votes, 0),
    completedProposals: proposals.filter(p => p.status === 'completed').length,
    activeCycle: cycles.find(c => c.isActive),
    totalChangelogs: changelogs.length,
  };
  
  res.json({
    success: true,
    message: '获取成功',
    data: stats,
  });
};

export const updateStatusHandler = (req: Request, res: Response) => {
  const { proposalId, status } = req.body;
  
  if (!proposalId || !status) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数',
      data: null,
    });
  }
  
  const proposal = updateProposalStatus(proposalId, status);
  
  if (!proposal) {
    return res.status(404).json({
      success: false,
      message: '提案不存在',
      data: null,
    });
  }
  
  res.json({
    success: true,
    message: '状态更新成功',
    data: proposal,
  });
};

export const pinProposalHandler = (req: Request, res: Response) => {
  const { proposalId, pinned } = req.body;
  
  if (!proposalId || pinned === undefined) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数',
      data: null,
    });
  }
  
  const proposal = pinProposal(proposalId, pinned);
  
  if (!proposal) {
    return res.status(404).json({
      success: false,
      message: '提案不存在',
      data: null,
    });
  }
  
  res.json({
    success: true,
    message: pinned ? '置顶成功' : '取消置顶成功',
    data: proposal,
  });
};

export const mergeProposalsHandler = (req: Request, res: Response) => {
  const { targetProposalId, sourceProposalIds } = req.body;
  
  if (!targetProposalId || !sourceProposalIds || sourceProposalIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数',
      data: null,
    });
  }
  
  const proposal = mergeProposals(targetProposalId, sourceProposalIds);
  
  if (!proposal) {
    return res.status(404).json({
      success: false,
      message: '目标提案不存在',
      data: null,
    });
  }
  
  res.json({
    success: true,
    message: '合并成功',
    data: proposal,
  });
};

export const createCycleHandler = (req: Request, res: Response) => {
  const { name, startDate, endDate, description } = req.body;
  
  if (!name || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数',
      data: null,
    });
  }
  
  const cycle = createVotingCycle({ name, startDate, endDate, description });
  
  res.json({
    success: true,
    message: '投票周期创建成功',
    data: cycle,
  });
};

export const createChangelogHandler = (req: Request, res: Response) => {
  const { version, title, description, decisions, relatedProposals, status } = req.body;
  
  if (!version || !title || !description || !decisions || !relatedProposals) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数',
      data: null,
    });
  }
  
  const changelog = createChangelog({
    version,
    title,
    description,
    decisions,
    relatedProposals: Array.isArray(relatedProposals) ? relatedProposals : [relatedProposals],
    status: status || 'completed',
  });
  
  res.json({
    success: true,
    message: '更新日志发布成功',
    data: changelog,
  });
};

export const getCyclesHandler = (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: '获取成功',
    data: getVotingCycles(),
  });
};
