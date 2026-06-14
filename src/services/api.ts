import type {
  Proposal,
  User,
  ChangelogEntry,
  ChangelogEntryWithProposals,
  VotingCycle,
  Comment,
  ApiResponse,
  GetProposalsParams,
  SubmitProposalRequest,
  SortBy,
  ProposalStatus,
  Announcement,
  AnnouncementType,
} from '../../shared/index.ts';

const API_BASE = '/api';

const getHeaders = (): HeadersInit => {
  const userId = localStorage.getItem('userId');
  return {
    'Content-Type': 'application/json',
    ...(userId && userId !== 'visitor' ? { 'x-user-id': userId } : {}),
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || '请求失败');
  }
  return data;
};

export const api = {
  getProposals: async (params?: GetProposalsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.userType) searchParams.set('userType', params.userType);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    
    const response = await fetch(`${API_BASE}/proposals?${searchParams}`, {
      headers: getHeaders(),
    });
    return handleResponse<ApiResponse<{ proposals: Proposal[]; total: number; page: number; limit: number }>>(response);
  },

  getProposal: async (id: string) => {
    const response = await fetch(`${API_BASE}/proposals/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse<ApiResponse<Proposal & { hasVoted: boolean; isWatching: boolean }>>(response);
  },

  createProposal: async (data: SubmitProposalRequest) => {
    const response = await fetch(`${API_BASE}/proposals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<Proposal>>(response);
  },

  vote: async (proposalId: string) => {
    const response = await fetch(`${API_BASE}/votes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ proposalId }),
    });
    return handleResponse<ApiResponse<null>>(response);
  },

  unvote: async (proposalId: string) => {
    const response = await fetch(`${API_BASE}/votes`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ proposalId }),
    });
    return handleResponse<ApiResponse<null>>(response);
  },

  checkVote: async (proposalId: string) => {
    const response = await fetch(`${API_BASE}/votes/${proposalId}`, {
      headers: getHeaders(),
    });
    return handleResponse<ApiResponse<{ hasVoted: boolean }>>(response);
  },

  toggleWatch: async (proposalId: string) => {
    const response = await fetch(`${API_BASE}/watches`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ proposalId }),
    });
    return handleResponse<ApiResponse<{ watching: boolean }>>(response);
  },

  checkWatch: async (proposalId: string) => {
    const response = await fetch(`${API_BASE}/watches/${proposalId}`, {
      headers: getHeaders(),
    });
    return handleResponse<ApiResponse<{ isWatching: boolean }>>(response);
  },

  addComment: async (proposalId: string, content: string, replyTo?: string) => {
    const response = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ proposalId, content, replyTo }),
    });
    return handleResponse<ApiResponse<Comment>>(response);
  },

  login: async (userId: string) => {
    const response = await fetch(`${API_BASE}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return handleResponse<ApiResponse<User>>(response);
  },

  getUsers: async () => {
    const response = await fetch(`${API_BASE}/user/list`, {
      headers: getHeaders(),
    });
    return handleResponse<ApiResponse<User[]>>(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE}/user/me`, {
      headers: getHeaders(),
    });
    return handleResponse<ApiResponse<User>>(response);
  },

  getChangelogs: async () => {
    const response = await fetch(`${API_BASE}/changelog`, {
      headers: getHeaders(),
    });
    return handleResponse<ApiResponse<ChangelogEntryWithProposals[]>>(response);
  },

  getActiveAnnouncements: async () => {
    const response = await fetch(`${API_BASE}/announcements`, {
      headers: getHeaders(),
    });
    return handleResponse<ApiResponse<Announcement[]>>(response);
  },

  getAdminAnnouncements: async () => {
    const response = await fetch(`${API_BASE}/admin/announcements`, {
      headers: getHeaders(),
    });
    return handleResponse<ApiResponse<Announcement[]>>(response);
  },

  createAnnouncement: async (data: { title: string; content: string; type: AnnouncementType; pinned?: boolean }) => {
    const response = await fetch(`${API_BASE}/admin/announcement`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<Announcement>>(response);
  },

  updateAnnouncement: async (data: {
    id: string;
    title?: string;
    content?: string;
    type?: AnnouncementType;
    pinned?: boolean;
    active?: boolean;
  }) => {
    const response = await fetch(`${API_BASE}/admin/announcement`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<Announcement>>(response);
  },

  getAdminStats: async () => {
    const response = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders(),
    });
    return handleResponse<ApiResponse<{
      totalProposals: number;
      totalVotes: number;
      completedProposals: number;
      activeCycle: VotingCycle | null;
      totalChangelogs: number;
    }>>(response);
  },

  updateProposalStatus: async (proposalId: string, status: ProposalStatus) => {
    const response = await fetch(`${API_BASE}/admin/proposal/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ proposalId, status }),
    });
    return handleResponse<ApiResponse<Proposal>>(response);
  },

  pinProposal: async (proposalId: string, pinned: boolean) => {
    const response = await fetch(`${API_BASE}/admin/proposal/pin`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ proposalId, pinned }),
    });
    return handleResponse<ApiResponse<Proposal>>(response);
  },

  mergeProposals: async (targetProposalId: string, sourceProposalIds: string[]) => {
    const response = await fetch(`${API_BASE}/admin/proposal/merge`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ targetProposalId, sourceProposalIds }),
    });
    return handleResponse<ApiResponse<Proposal>>(response);
  },

  createVotingCycle: async (data: { name: string; startDate: string; endDate: string; description: string }) => {
    const response = await fetch(`${API_BASE}/admin/cycle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<VotingCycle>>(response);
  },

  getVotingCycles: async () => {
    const response = await fetch(`${API_BASE}/admin/cycles`, {
      headers: getHeaders(),
    });
    return handleResponse<ApiResponse<VotingCycle[]>>(response);
  },

  createChangelog: async (data: {
    version: string;
    title: string;
    description: string;
    decisions: string;
    relatedProposals: string[];
    status: 'completed' | 'partial' | 'rejected';
  }) => {
    const response = await fetch(`${API_BASE}/admin/changelog`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<ChangelogEntry>>(response);
  },
};
