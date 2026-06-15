export type ProposalStatus = 'planning' | 'voting' | 'developing' | 'completed' | 'rejected';
export type UserType = 'visitor' | 'user' | 'maintainer';
export type SortBy = 'votes' | 'recent' | 'newest';
export type ChangelogStatus = 'completed' | 'partial' | 'rejected';
export type AnnouncementType = 'info' | 'warning' | 'success' | 'important';
export type AnnouncementScope = 'all' | 'home' | 'proposal_detail';

export interface User {
  id: string;
  name: string;
  avatar: string;
  type: UserType;
  githubUrl?: string;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  replyTo?: string;
  createdAt: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  useCases: string[];
  estimatedWork: string;
  status: ProposalStatus;
  votes: number;
  recentVotes: number;
  watchers: number;
  authorId: string;
  author: User;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  mergedFrom?: MergedSourceInfo[];
  mergedTo?: string;
  pinned?: boolean;
  votingCycleId?: string;
}

export interface MergedSourceInfo {
  proposalId: string;
  title: string;
  originalVotes: number;
  originalWatchers: number;
  originalComments: number;
  mergedAt: string;
}

export interface VoteRecord {
  id: string;
  proposalId: string;
  userId: string;
  votedAt: string;
}

export interface WatchRecord {
  id: string;
  proposalId: string;
  userId: string;
  createdAt: string;
}

export interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  description: string;
  decisions: string;
  relatedProposals: string[];
  status: ChangelogStatus;
  releasedAt: string;
}

export interface VotingCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  pinned: boolean;
  active: boolean;
  scope: AnnouncementScope;
  effectiveAt?: string;
  expiresAt?: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface RelatedProposalInfo {
  id: string;
  title: string;
  votes: number;
  status: ProposalStatus;
  watchers?: number;
  author?: string;
  decisionNote?: string;
}

export interface ChangelogEntryWithProposals extends ChangelogEntry {
  relatedProposalDetails: RelatedProposalInfo[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface GetProposalsParams {
  status?: ProposalStatus;
  sortBy?: SortBy;
  userType?: UserType;
  page?: number;
  limit?: number;
  respectPinned?: boolean;
}

export interface SubmitProposalRequest {
  title: string;
  description: string;
  useCases: string[];
  estimatedWork: string;
}

export interface VoteRequest {
  proposalId: string;
}

export interface CommentRequest {
  proposalId: string;
  content: string;
  replyTo?: string;
}

export interface MergeProposalsRequest {
  targetProposalId: string;
  sourceProposalIds: string[];
}

export interface UpdateProposalStatusRequest {
  proposalId: string;
  status: ProposalStatus;
}

export interface CreateVotingCycleRequest {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CreateChangelogRequest {
  version: string;
  title: string;
  description: string;
  decisions: string;
  relatedProposals: string[];
  status: ChangelogStatus;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  type: AnnouncementType;
  pinned?: boolean;
  scope?: AnnouncementScope;
  effectiveAt?: string;
  expiresAt?: string;
}

export interface UpdateAnnouncementRequest {
  id: string;
  title?: string;
  content?: string;
  type?: AnnouncementType;
  pinned?: boolean;
  active?: boolean;
  scope?: AnnouncementScope;
  effectiveAt?: string;
  expiresAt?: string;
}

export const STATUS_LABELS: Record<ProposalStatus, string> = {
  planning: '规划中',
  voting: '投票中',
  developing: '开发中',
  completed: '已完成',
  rejected: '暂不考虑',
};

export const STATUS_COLORS: Record<ProposalStatus, string> = {
  planning: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  voting: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  developing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};
