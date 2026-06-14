import type { Request, Response } from 'express';
import {
  getProposals,
  getChangelogs,
  getVotingCycles,
  getAllAnnouncements,
  updateProposalStatus,
  pinProposal,
  mergeProposals,
  createVotingCycle,
  createChangelog,
  createAnnouncement,
  updateAnnouncement,
} from '../repositories/mockData.ts';

export const getStatsHandler = (_req: Request, res: Response) => {
  const { proposals } = getProposals();
  const changelogs = getChangelogs();
  const cycles = getVotingCycles();
  const announcements = getAllAnnouncements();

  const stats = {
    totalProposals: proposals.length,
    totalVotes: proposals.reduce((sum, p) => sum + p.votes, 0),
    completedProposals: proposals.filter(p => p.status === 'completed').length,
    activeCycle: cycles.find(c => c.isActive),
    totalChangelogs: changelogs.length,
    activeAnnouncements: announcements.filter(a => a.active).length,
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

  const result = mergeProposals(targetProposalId, sourceProposalIds);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: '目标提案不存在',
      data: null,
    });
  }

  res.json({
    success: true,
    message: `合并成功，新增 ${result.stats.newVotes} 票、${result.stats.newWatches} 个关注、${result.stats.newComments} 条评论`,
    data: result,
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

export const getAnnouncementsHandler = (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: '获取成功',
    data: getAllAnnouncements(),
  });
};

export const createAnnouncementHandler = (req: Request, res: Response) => {
  const { title, content, type, pinned } = req.body;
  const userId = req.user?.id;

  if (!userId || req.user?.type !== 'maintainer') {
    return res.status(403).json({
      success: false,
      message: '需要维护者权限',
      data: null,
    });
  }

  if (!title || !content || !type) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数',
      data: null,
    });
  }

  const announcement = createAnnouncement({
    title,
    content,
    type,
    pinned: pinned || false,
    authorId: userId,
  });

  if (!announcement) {
    return res.status(500).json({
      success: false,
      message: '创建失败',
      data: null,
    });
  }

  res.json({
    success: true,
    message: '公告发布成功',
    data: announcement,
  });
};

export const updateAnnouncementHandler = (req: Request, res: Response) => {
  const { id, title, content, type, pinned, active } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: '缺少公告ID',
      data: null,
    });
  }

  const announcement = updateAnnouncement(id, {
    title,
    content,
    type,
    pinned,
    active,
  });

  if (!announcement) {
    return res.status(404).json({
      success: false,
      message: '公告不存在',
      data: null,
    });
  }

  res.json({
    success: true,
    message: '更新成功',
    data: announcement,
  });
};
