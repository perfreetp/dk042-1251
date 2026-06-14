import type {
  User,
  Proposal,
  ChangelogEntry,
  VotingCycle,
  VoteRecord,
  Comment,
  WatchRecord,
} from '../../../shared/index.ts';

export const mockUsers: User[] = [
  { id: 'u1', name: '张开源', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u1', type: 'maintainer' },
  { id: 'u2', name: '李贡献', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u2', type: 'user' },
  { id: 'u3', name: '王开发者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u3', type: 'user' },
  { id: 'u4', name: '赵测试', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u4', type: 'user' },
  { id: 'u5', name: '陈设计', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u5', type: 'user' },
];

export const mockComments: Comment[] = [
  {
    id: 'cm1',
    userId: 'u3',
    user: mockUsers[2],
    content: '这个功能太需要了！我们项目中大量使用装饰器，目前的类型推断确实不够完善。',
    createdAt: '2026-06-02T14:30:00Z',
  },
  {
    id: 'cm2',
    userId: 'u4',
    user: mockUsers[3],
    content: '建议同时支持装饰器的元数据反射，这对 DI 框架很重要。',
    replyTo: 'cm1',
    createdAt: '2026-06-03T09:15:00Z',
  },
  {
    id: 'cm3',
    userId: 'u5',
    user: mockUsers[4],
    content: 'WebAssembly 方案听起来很棒，但担心会增加包体积，能否提供按需加载的选项？',
    createdAt: '2026-05-29T11:00:00Z',
  },
];

export const mockProposals: Proposal[] = [
  {
    id: 'p1',
    title: '支持 TypeScript 5.0 装饰器语法',
    description: '升级编译器以支持 TypeScript 5.0 引入的最新装饰器语法标准，提供更好的类型推断和元编程能力。',
    useCases: [
      '使用 @decorator 语法简化依赖注入',
      '在类上使用元数据装饰器进行 ORM 映射',
      '实现自定义验证装饰器',
    ],
    estimatedWork: '3-4 人周',
    status: 'voting',
    votes: 256,
    recentVotes: 42,
    watchers: 89,
    authorId: 'u2',
    author: mockUsers[1],
    comments: [mockComments[0], mockComments[1]],
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-14T08:30:00Z',
    votingCycleId: 'vc1',
  },
  {
    id: 'p2',
    title: '引入 WebAssembly 提升性能瓶颈模块',
    description: '将计算密集型模块（如 AST 解析、正则匹配）重写为 Rust 并编译为 WebAssembly，预计提升 3-5 倍性能。',
    useCases: [
      '大型项目的编译速度提升',
      '复杂正则表达式匹配优化',
      '实时语法检查性能改进',
    ],
    estimatedWork: '8-10 人周',
    status: 'voting',
    votes: 189,
    recentVotes: 28,
    watchers: 67,
    authorId: 'u3',
    author: mockUsers[2],
    comments: [mockComments[2]],
    createdAt: '2026-05-28T14:20:00Z',
    updatedAt: '2026-06-13T16:45:00Z',
    votingCycleId: 'vc1',
  },
  {
    id: 'p3',
    title: '内置国际化 (i18n) 支持',
    description: '提供开箱即用的多语言支持框架，包括语言包管理、动态切换、日期/数字格式化等功能。',
    useCases: [
      '快速支持多种语言界面',
      '语言包热更新',
      '地区化日期和货币显示',
    ],
    estimatedWork: '2-3 人周',
    status: 'developing',
    votes: 312,
    recentVotes: 15,
    watchers: 124,
    authorId: 'u2',
    author: mockUsers[1],
    comments: [],
    createdAt: '2026-05-15T09:00:00Z',
    updatedAt: '2026-06-10T11:20:00Z',
  },
  {
    id: 'p4',
    title: '插件市场生态系统',
    description: '构建官方插件市场，允许开发者发布和分享插件，支持版本管理、评分、安装统计等功能。',
    useCases: [
      '一键安装社区插件',
      '插件版本自动更新',
      '开发者收益分成机制',
    ],
    estimatedWork: '6-8 人周',
    status: 'planning',
    votes: 145,
    recentVotes: 56,
    watchers: 98,
    authorId: 'u4',
    author: mockUsers[3],
    comments: [],
    createdAt: '2026-06-10T11:30:00Z',
    updatedAt: '2026-06-14T20:00:00Z',
    pinned: true,
    votingCycleId: 'vc1',
  },
  {
    id: 'p5',
    title: '零配置项目脚手架',
    description: '提供交互式项目初始化工具，根据用户需求自动生成最佳实践的项目结构和配置文件。',
    useCases: [
      '快速启动新项目',
      '统一团队代码规范',
      '预设常见技术栈组合',
    ],
    estimatedWork: '1-2 人周',
    status: 'completed',
    votes: 478,
    recentVotes: 0,
    watchers: 156,
    authorId: 'u2',
    author: mockUsers[1],
    comments: [],
    createdAt: '2026-04-20T08:00:00Z',
    updatedAt: '2026-06-05T14:00:00Z',
  },
  {
    id: 'p6',
    title: '服务端渲染 (SSR) 性能优化',
    description: '优化 SSR 渲染管线，引入流式渲染、组件级缓存、自动水合等技术，大幅提升首屏加载速度。',
    useCases: [
      '提升 SEO 友好度',
      '改善移动端首屏体验',
      '降低服务器负载',
    ],
    estimatedWork: '4-6 人周',
    status: 'rejected',
    votes: 89,
    recentVotes: 5,
    watchers: 34,
    authorId: 'u3',
    author: mockUsers[2],
    comments: [],
    createdAt: '2026-05-10T15:00:00Z',
    updatedAt: '2026-06-08T09:30:00Z',
  },
  {
    id: 'p7',
    title: '支持 Monorepo 工作空间',
    description: '原生支持 pnpm/yarn/npm workspaces，提供跨包依赖分析、批量构建、增量更新等能力。',
    useCases: [
      '大型多包项目管理',
      '组件库版本管理',
      '微前端架构支持',
    ],
    estimatedWork: '5-7 人周',
    status: 'voting',
    votes: 167,
    recentVotes: 38,
    watchers: 72,
    authorId: 'u5',
    author: mockUsers[4],
    comments: [],
    createdAt: '2026-06-05T16:00:00Z',
    updatedAt: '2026-06-14T12:00:00Z',
    votingCycleId: 'vc1',
  },
  {
    id: 'p8',
    title: '可视化调试器 DevTools',
    description: '提供浏览器扩展和桌面端调试工具，支持状态时间旅行、组件树可视化、性能分析等功能。',
    useCases: [
      '复杂应用状态调试',
      '性能瓶颈定位',
      '组件层级分析',
    ],
    estimatedWork: '6-9 人周',
    status: 'planning',
    votes: 98,
    recentVotes: 22,
    watchers: 45,
    authorId: 'u4',
    author: mockUsers[3],
    comments: [],
    createdAt: '2026-06-12T10:00:00Z',
    updatedAt: '2026-06-14T18:00:00Z',
  },
];

export const mockVotes: VoteRecord[] = [
  { id: 'v1', proposalId: 'p1', userId: 'u2', votedAt: '2026-06-01T11:00:00Z' },
  { id: 'v2', proposalId: 'p1', userId: 'u3', votedAt: '2026-06-02T08:00:00Z' },
  { id: 'v3', proposalId: 'p2', userId: 'u2', votedAt: '2026-05-29T10:00:00Z' },
];

export const mockWatches: WatchRecord[] = [
  { id: 'w1', proposalId: 'p1', userId: 'u2', createdAt: '2026-06-01T11:00:00Z' },
  { id: 'w2', proposalId: 'p2', userId: 'u3', createdAt: '2026-05-28T15:00:00Z' },
];

export const mockChangelogs: ChangelogEntry[] = [
  {
    id: 'c1',
    version: 'v2.4.0',
    title: '零配置项目脚手架正式发布',
    description: '经过两个月的开发和社区测试，零配置项目脚手架功能正式上线。支持 React、Vue、Node.js 等多种技术栈的快速初始化。',
    decisions: '我们决定优先实现此功能，因为社区投票中获得了最高支持（478 票）。相比 SSR 优化（89 票），脚手架对新手用户的入门体验改进更为直接。',
    relatedProposals: ['p5'],
    status: 'completed',
    releasedAt: '2026-06-05T14:00:00Z',
  },
  {
    id: 'c2',
    version: 'v2.3.0',
    title: '国际化支持 Beta 测试',
    description: '内置国际化框架进入 Beta 阶段，已支持中英日韩四种语言。欢迎社区参与翻译和测试。',
    decisions: '虽然完整的插件市场呼声也很高，但国际化是当前 30% 非英语用户的迫切需求。我们决定先完成 i18n 基础框架，再投入插件生态建设。',
    relatedProposals: ['p3', 'p4'],
    status: 'partial',
    releasedAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'c3',
    version: 'v2.2.0',
    title: '性能优化与稳定性改进',
    description: '本版本重点优化了构建速度和内存占用，大型项目构建时间平均减少 40%。',
    decisions: '在路线图投票中，性能相关提案获得了广泛关注。虽然 WebAssembly 方案仍在评估中，但我们先对现有 JavaScript 代码进行了深度优化。',
    relatedProposals: ['p2'],
    status: 'completed',
    releasedAt: '2026-05-15T09:00:00Z',
  },
];

export const mockVotingCycles: VotingCycle[] = [
  {
    id: 'vc1',
    name: '2026 Q3 路线图投票',
    startDate: '2026-06-01T00:00:00Z',
    endDate: '2026-06-30T23:59:59Z',
    isActive: true,
    description: '第三季度开发路线图投票，选出最受社区期待的 3 个功能优先开发。',
  },
  {
    id: 'vc2',
    name: '2026 Q2 路线图投票',
    startDate: '2026-04-01T00:00:00Z',
    endDate: '2026-04-30T23:59:59Z',
    isActive: false,
    description: '第二季度开发路线图投票，已完成。',
  },
];

let proposals = [...mockProposals];
let votes = [...mockVotes];
let watches = [...mockWatches];
let comments = [...mockComments];

export const getProposals = () => proposals;
export const getProposalById = (id: string) => proposals.find(p => p.id === id);
export const getUsers = () => mockUsers;
export const getUserById = (id: string) => mockUsers.find(u => u.id === id);
export const getChangelogs = () => mockChangelogs;
export const getVotingCycles = () => mockVotingCycles;

export const addVote = (proposalId: string, userId: string) => {
  const existingVote = votes.find(v => v.proposalId === proposalId && v.userId === userId);
  if (existingVote) return null;
  
  const newVote: VoteRecord = {
    id: `v${Date.now()}`,
    proposalId,
    userId,
    votedAt: new Date().toISOString(),
  };
  votes.push(newVote);
  
  const proposal = proposals.find(p => p.id === proposalId);
  if (proposal) {
    proposal.votes += 1;
    proposal.recentVotes += 1;
    proposal.updatedAt = new Date().toISOString();
  }
  
  return newVote;
};

export const removeVote = (proposalId: string, userId: string) => {
  const voteIndex = votes.findIndex(v => v.proposalId === proposalId && v.userId === userId);
  if (voteIndex === -1) return false;
  
  votes.splice(voteIndex, 1);
  
  const proposal = proposals.find(p => p.id === proposalId);
  if (proposal) {
    proposal.votes = Math.max(0, proposal.votes - 1);
    proposal.recentVotes = Math.max(0, proposal.recentVotes - 1);
    proposal.updatedAt = new Date().toISOString();
  }
  
  return true;
};

export const hasVoted = (proposalId: string, userId: string) => {
  return votes.some(v => v.proposalId === proposalId && v.userId === userId);
};

export const toggleWatch = (proposalId: string, userId: string) => {
  const watchIndex = watches.findIndex(w => w.proposalId === proposalId && w.userId === userId);
  const proposal = proposals.find(p => p.id === proposalId);
  
  if (watchIndex === -1) {
    const newWatch: WatchRecord = {
      id: `w${Date.now()}`,
      proposalId,
      userId,
      createdAt: new Date().toISOString(),
    };
    watches.push(newWatch);
    if (proposal) proposal.watchers += 1;
    return { watching: true };
  } else {
    watches.splice(watchIndex, 1);
    if (proposal) proposal.watchers = Math.max(0, proposal.watchers - 1);
    return { watching: false };
  }
};

export const isWatching = (proposalId: string, userId: string) => {
  return watches.some(w => w.proposalId === proposalId && w.userId === userId);
};

export const addComment = (proposalId: string, userId: string, content: string, replyTo?: string) => {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return null;
  
  const newComment: Comment = {
    id: `cm${Date.now()}`,
    userId,
    user,
    content,
    replyTo,
    createdAt: new Date().toISOString(),
  };
  
  comments.push(newComment);
  
  const proposal = proposals.find(p => p.id === proposalId);
  if (proposal) {
    proposal.comments.push(newComment);
    proposal.updatedAt = new Date().toISOString();
  }
  
  return newComment;
};

export const createProposal = (data: {
  title: string;
  description: string;
  useCases: string[];
  estimatedWork: string;
  authorId: string;
}) => {
  const author = mockUsers.find(u => u.id === data.authorId);
  if (!author) return null;
  
  const newProposal: Proposal = {
    id: `p${Date.now()}`,
    title: data.title,
    description: data.description,
    useCases: data.useCases,
    estimatedWork: data.estimatedWork,
    status: 'planning',
    votes: 0,
    recentVotes: 0,
    watchers: 1,
    authorId: data.authorId,
    author,
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  proposals.unshift(newProposal);
  
  watches.push({
    id: `w${Date.now()}`,
    proposalId: newProposal.id,
    userId: data.authorId,
    createdAt: new Date().toISOString(),
  });
  
  return newProposal;
};

export const updateProposalStatus = (proposalId: string, status: Proposal['status']) => {
  const proposal = proposals.find(p => p.id === proposalId);
  if (!proposal) return null;
  proposal.status = status;
  proposal.updatedAt = new Date().toISOString();
  return proposal;
};

export const pinProposal = (proposalId: string, pinned: boolean) => {
  const proposal = proposals.find(p => p.id === proposalId);
  if (!proposal) return null;
  proposal.pinned = pinned;
  proposal.updatedAt = new Date().toISOString();
  return proposal;
};

export const mergeProposals = (targetId: string, sourceIds: string[]) => {
  const target = proposals.find(p => p.id === targetId);
  if (!target) return null;
  
  const sources = proposals.filter(p => sourceIds.includes(p.id));
  
  target.votes += sources.reduce((sum, s) => sum + s.votes, 0);
  target.recentVotes += sources.reduce((sum, s) => sum + s.recentVotes, 0);
  target.watchers += sources.reduce((sum, s) => sum + s.watchers, 0);
  target.mergedFrom = [...(target.mergedFrom || []), ...sourceIds];
  target.updatedAt = new Date().toISOString();
  
  sources.forEach(s => {
    s.status = 'rejected';
    s.updatedAt = new Date().toISOString();
  });
  
  return target;
};

export const createVotingCycle = (data: {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
}) => {
  const newCycle: VotingCycle = {
    id: `vc${Date.now()}`,
    name: data.name,
    startDate: data.startDate,
    endDate: data.endDate,
    isActive: false,
    description: data.description,
  };
  
  (mockVotingCycles as VotingCycle[]).push(newCycle);
  return newCycle;
};

export const createChangelog = (data: {
  version: string;
  title: string;
  description: string;
  decisions: string;
  relatedProposals: string[];
  status: ChangelogEntry['status'];
}) => {
  const newChangelog: ChangelogEntry = {
    id: `c${Date.now()}`,
    version: data.version,
    title: data.title,
    description: data.description,
    decisions: data.decisions,
    relatedProposals: data.relatedProposals,
    status: data.status,
    releasedAt: new Date().toISOString(),
  };
  
  (mockChangelogs as ChangelogEntry[]).unshift(newChangelog);
  return newChangelog;
};
