import { create } from 'zustand';
import type { User, Proposal, ProposalStatus, SortBy, ChangelogEntry, VotingCycle } from '../../shared/index.ts';
import { api } from '../services/api.ts';

interface AppState {
  user: User | null;
  proposals: Proposal[];
  filteredProposals: Proposal[];
  currentProposal: (Proposal & { hasVoted: boolean; isWatching: boolean }) | null;
  changelogs: ChangelogEntry[];
  votingCycles: VotingCycle[];
  statusFilter: ProposalStatus | 'all';
  sortBy: SortBy;
  loading: boolean;
  error: string | null;
  initUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => void;
  fetchProposals: (status?: ProposalStatus | 'all', sortBy?: SortBy) => Promise<void>;
  fetchProposal: (id: string) => Promise<void>;
  fetchChangelog: () => Promise<void>;
  fetchVotingCycles: () => Promise<void>;
  vote: (proposalId: string) => Promise<boolean>;
  unvote: (proposalId: string) => Promise<boolean>;
  toggleWatch: (proposalId: string) => Promise<boolean>;
  setStatusFilter: (status: ProposalStatus | 'all') => void;
  setSortBy: (sortBy: SortBy) => void;
  addComment: (proposalId: string, content: string) => Promise<boolean>;
  createProposal: (data: { title: string; description: string; useCases: string[]; estimatedWork: string }) => Promise<Proposal | null>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  proposals: [],
  filteredProposals: [],
  currentProposal: null,
  changelogs: [],
  votingCycles: [],
  statusFilter: 'all',
  sortBy: 'votes',
  loading: false,
  error: null,

  initUser: async () => {
    const userId = localStorage.getItem('userId');
    if (userId && userId !== 'visitor') {
      try {
        const response = await api.getCurrentUser();
        if (response.success) {
          set({ user: response.data });
        }
      } catch (err) {
        console.error('Failed to init user:', err);
      }
    }
  },

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem('userId', user.id);
    } else {
      localStorage.removeItem('userId');
    }
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem('userId');
  },

  fetchProposals: async (status, sortBy) => {
    set({ loading: true, error: null });
    try {
      const currentSort = sortBy || get().sortBy;
      const params = status && status !== 'all' ? { status, sortBy: currentSort } : { sortBy: currentSort };
      const response = await api.getProposals(params);
      set({
        proposals: response.data.proposals,
        filteredProposals: response.data.proposals,
        loading: false,
      });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchProposal: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.getProposal(id);
      set({ currentProposal: response.data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  vote: async (proposalId) => {
    try {
      await api.vote(proposalId);
      const { currentProposal, proposals } = get();
      
      if (currentProposal && currentProposal.id === proposalId) {
        set({
          currentProposal: {
            ...currentProposal,
            votes: currentProposal.votes + 1,
            recentVotes: currentProposal.recentVotes + 1,
            hasVoted: true,
          },
        });
      }
      
      set({
        proposals: proposals.map(p =>
          p.id === proposalId
            ? { ...p, votes: p.votes + 1, recentVotes: p.recentVotes + 1 }
            : p
        ),
        filteredProposals: get().filteredProposals.map(p =>
          p.id === proposalId
            ? { ...p, votes: p.votes + 1, recentVotes: p.recentVotes + 1 }
            : p
        ),
      });
      
      return true;
    } catch (err) {
      set({ error: (err as Error).message });
      return false;
    }
  },

  unvote: async (proposalId) => {
    try {
      await api.unvote(proposalId);
      const { currentProposal, proposals } = get();
      
      if (currentProposal && currentProposal.id === proposalId) {
        set({
          currentProposal: {
            ...currentProposal,
            votes: Math.max(0, currentProposal.votes - 1),
            recentVotes: Math.max(0, currentProposal.recentVotes - 1),
            hasVoted: false,
          },
        });
      }
      
      set({
        proposals: proposals.map(p =>
          p.id === proposalId
            ? { ...p, votes: Math.max(0, p.votes - 1), recentVotes: Math.max(0, p.recentVotes - 1) }
            : p
        ),
        filteredProposals: get().filteredProposals.map(p =>
          p.id === proposalId
            ? { ...p, votes: Math.max(0, p.votes - 1), recentVotes: Math.max(0, p.recentVotes - 1) }
            : p
        ),
      });
      
      return true;
    } catch (err) {
      set({ error: (err as Error).message });
      return false;
    }
  },

  toggleWatch: async (proposalId) => {
    try {
      const response = await api.toggleWatch(proposalId);
      const { currentProposal, proposals } = get();
      const watching = response.data.watching;
      
      if (currentProposal && currentProposal.id === proposalId) {
        set({
          currentProposal: {
            ...currentProposal,
            watchers: watching ? currentProposal.watchers + 1 : Math.max(0, currentProposal.watchers - 1),
            isWatching: watching,
          },
        });
      }
      
      set({
        proposals: proposals.map(p =>
          p.id === proposalId
            ? { ...p, watchers: watching ? p.watchers + 1 : Math.max(0, p.watchers - 1) }
            : p
        ),
        filteredProposals: get().filteredProposals.map(p =>
          p.id === proposalId
            ? { ...p, watchers: watching ? p.watchers + 1 : Math.max(0, p.watchers - 1) }
            : p
        ),
      });
      
      return watching;
    } catch (err) {
      set({ error: (err as Error).message });
      return false;
    }
  },

  setStatusFilter: (status) => {
    const { proposals, sortBy } = get();
    set({ statusFilter: status });
    get().fetchProposals(status, sortBy);
  },

  setSortBy: (sortBy) => {
    const { statusFilter } = get();
    set({ sortBy });
    get().fetchProposals(statusFilter, sortBy);
  },

  addComment: async (proposalId, content) => {
    try {
      const response = await api.addComment(proposalId, content);
      const { currentProposal } = get();
      
      if (currentProposal && currentProposal.id === proposalId) {
        set({
          currentProposal: {
            ...currentProposal,
            comments: [...currentProposal.comments, response.data],
          },
        });
      }
      
      return true;
    } catch (err) {
      set({ error: (err as Error).message });
      return false;
    }
  },

  createProposal: async (data) => {
    try {
      const response = await api.createProposal(data);
      const { proposals } = get();
      set({
        proposals: [response.data, ...proposals],
        filteredProposals: [response.data, ...get().filteredProposals],
      });
      return response.data;
    } catch (err) {
      set({ error: (err as Error).message });
      return null;
    }
  },

  fetchChangelog: async () => {
    try {
      const response = await api.getChangelogs();
      if (response.success) {
        set({ changelogs: response.data });
      }
    } catch (err) {
      console.error('Failed to fetch changelog:', err);
    }
  },

  fetchVotingCycles: async () => {
    try {
      const response = await api.getVotingCycles();
      if (response.success) {
        set({ votingCycles: response.data });
      }
    } catch (err) {
      console.error('Failed to fetch voting cycles:', err);
    }
  },
}));
