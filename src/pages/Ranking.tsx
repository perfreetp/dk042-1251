import { useEffect, useState } from 'react';
import {
  Trophy,
  Flame,
  TrendingUp,
  Clock,
  Medal,
  Crown,
  Award,
} from 'lucide-react';
import type { SortBy, Proposal, UserType } from '../../shared/index.ts';
import { ProposalCard } from '../components/ProposalCard.tsx';
import { api } from '../services/api.ts';
import { cn } from '../lib/utils.ts';

type RankingFilter = 'all' | 'voting' | 'developing';
type UserFilter = 'all' | 'maintainer' | 'user';

export default function Ranking() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('votes');
  const [statusFilter, setStatusFilter] = useState<RankingFilter>('all');
  const [userFilter, setUserFilter] = useState<UserFilter>('all');

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const params: any = { sortBy, respectPinned: false };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (userFilter !== 'all') {
        params.userType = userFilter;
      }
      const response = await api.getProposals(params);
      setProposals(response.data.proposals);
    } catch (err) {
      console.error('Failed to fetch rankings:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRankings();
  }, [sortBy, statusFilter, userFilter]);

  const sortOptions: { value: SortBy; label: string; icon: typeof Flame }[] = [
    { value: 'votes', label: '总热度', icon: Flame },
    { value: 'recent', label: '近期增长', icon: TrendingUp },
    { value: 'newest', label: '最新发布', icon: Clock },
  ];

  const statusOptions: { value: RankingFilter; label: string }[] = [
    { value: 'all', label: '全部状态' },
    { value: 'voting', label: '投票中' },
    { value: 'developing', label: '开发中' },
  ];

  const userOptions: { value: UserFilter; label: string }[] = [
    { value: 'all', label: '所有用户' },
    { value: 'maintainer', label: '维护者' },
    { value: 'user', label: '社区用户' },
  ];

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="text-amber-400" size={24} />;
    if (index === 1) return <Medal className="text-slate-300" size={22} />;
    if (index === 2) return <Award className="text-amber-600" size={22} />;
    return null;
  };

  const topThree = proposals.slice(0, 3);
  const rest = proposals.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-lg shadow-amber-500/25">
              <Trophy className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              投票排行榜
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              发现社区最期待的功能，每一票都在塑造项目的未来
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    sortBy === option.value
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  <option.icon size={14} />
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    statusFilter === option.value
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
              {userOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setUserFilter(option.value)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    userFilter === option.value
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-10 text-sm text-slate-400">
            <span>当前筛选：</span>
            <span className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {sortOptions.find(o => o.value === sortBy)?.label}
            </span>
            <span className="text-slate-600">·</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-700/50 text-slate-300 border border-slate-600/50">
              {statusOptions.find(o => o.value === statusFilter)?.label}
            </span>
            <span className="text-slate-600">·</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {userOptions.find(o => o.value === userFilter)?.label}
            </span>
            <span className="text-slate-500 ml-2">
              共 {proposals.length} 个提案
            </span>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-slate-800/50 rounded-2xl animate-pulse border border-slate-700/50" />
              ))}
            </div>
          ) : (
            <>
              {topThree.length > 0 && (
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {topThree.map((proposal, index) => (
                    <div
                      key={proposal.id}
                      className={cn(
                        'relative bg-slate-800/50 rounded-2xl border p-6 transition-all hover:-translate-y-1',
                        index === 0
                          ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-slate-800/50 to-transparent md:scale-105'
                          : index === 1
                          ? 'border-slate-400/30 bg-gradient-to-br from-slate-400/5 via-slate-800/50 to-transparent'
                          : 'border-amber-700/30 bg-gradient-to-br from-amber-700/5 via-slate-800/50 to-transparent'
                      )}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
                            index === 0
                              ? 'bg-gradient-to-br from-amber-400 to-yellow-600'
                              : index === 1
                              ? 'bg-gradient-to-br from-slate-300 to-slate-500'
                              : 'bg-gradient-to-br from-amber-600 to-amber-800'
                          )}
                        >
                          {getRankIcon(index) || (
                            <span className="text-white font-bold text-lg">
                              {index + 1}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-center mt-6 mb-4">
                        <div className="text-4xl font-bold text-white font-mono mb-1">
                          {proposal.votes}
                        </div>
                        <p className="text-sm text-slate-400">票</p>
                        {proposal.recentVotes > 0 && (
                          <p className="text-sm text-emerald-400 mt-1 flex items-center justify-center gap-1">
                            <TrendingUp size={14} />
                            +{proposal.recentVotes} 近期
                          </p>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-white text-center mb-2 line-clamp-2">
                        {proposal.title}
                      </h3>
                      <p className="text-sm text-slate-400 text-center line-clamp-2 mb-4">
                        {proposal.description}
                      </p>

                      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                        <img
                          src={proposal.author.avatar}
                          alt={proposal.author.name}
                          className="w-5 h-5 rounded-full"
                        />
                        <span>{proposal.author.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {rest.length > 0 && (
                <div className="space-y-3">
                  {rest.map((proposal, index) => (
                    <div
                      key={proposal.id}
                      className="flex items-center gap-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl p-4 border border-slate-700/30 transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400 font-bold font-mono text-lg flex-shrink-0">
                        {index + 4}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">
                          {proposal.title}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <img
                              src={proposal.author.avatar}
                              alt={proposal.author.name}
                              className="w-4 h-4 rounded-full"
                            />
                            {proposal.author.name}
                          </span>
                          {proposal.recentVotes > 0 && (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <TrendingUp size={12} />
                              +{proposal.recentVotes}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-bold text-white font-mono">
                          {proposal.votes}
                        </div>
                        <div className="text-xs text-slate-500">票</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {proposals.length === 0 && (
                <div className="text-center py-16">
                  <Trophy className="text-slate-600 mx-auto mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-white mb-2">暂无排行数据</h3>
                  <p className="text-slate-400">当前筛选条件下暂无提案</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
