import { useEffect } from 'react';
import {
  Map,
  Vote,
  CheckCircle2,
  Users,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../store/useStore.ts';
import { ProposalCard } from '../components/ProposalCard.tsx';
import { StatusFilter } from '../components/StatusFilter.tsx';
import { SortSelector } from '../components/SortSelector.tsx';
import AnnouncementBar from '../components/AnnouncementBar.tsx';

export default function Home() {
  const { filteredProposals, loading, fetchProposals, fetchAnnouncements, proposals } = useStore();

  useEffect(() => {
    fetchProposals();
    fetchAnnouncements('home');
  }, [fetchProposals, fetchAnnouncements]);

  const stats = {
    total: proposals.length,
    voting: proposals.filter(p => p.status === 'voting').length,
    developing: proposals.filter(p => p.status === 'developing').length,
    completed: proposals.filter(p => p.status === 'completed').length,
    totalVotes: proposals.reduce((sum, p) => sum + p.votes, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-900/20 via-slate-900/50 to-blue-900/20 border border-sky-500/10 p-8 md:p-12 mb-12">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYmgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptLTYgMGg0djFoLTR2LTF6bTEyLTZoLTR2MWg0di0xem0tNiAwaC00djFoNHYtMXptLTEyIDBoLTR2MWg0di0xem0xMiA2aC00djFoNHYtMXptLTYgMGgtNHYxaDR2LTF6bTEyLTZoLTR2MWg0di0xem0tNiAwaC00djFoNHYtMXptLTEyIDBoLTR2MWg0di0xem0xMiA2aC00djFoNHYtMXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
                  <Map className="text-white" size={24} />
                </div>
                <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-sm font-medium border border-sky-500/20">
                  公开路线图
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                让社区声音主导
                <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent"> 项目发展方向</span>
              </h1>
              
              <p className="text-lg text-slate-400 max-w-2xl mb-8">
                浏览待开发功能、投票支持您期待的特性、提交新的功能提案。
                每一票都将影响项目的未来路线图。
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Vote size={14} />
                    总投票数
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">
                    {stats.totalVotes.toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Sparkles size={14} />
                    总提案
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">
                    {stats.total}
                  </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Users size={14} />
                    投票中
                  </div>
                  <div className="text-2xl font-bold text-sky-400 font-mono">
                    {stats.voting}
                  </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <CheckCircle2 size={14} />
                    已完成
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 font-mono">
                    {stats.completed}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AnnouncementBar />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <StatusFilter />
            <SortSelector />
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-800/50 rounded-2xl p-6 animate-pulse border border-slate-700/50">
                  <div className="h-6 bg-slate-700 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-slate-700 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-700 rounded w-2/3 mb-4" />
                  <div className="h-2 bg-slate-700 rounded-full w-full" />
                </div>
              ))}
            </div>
          ) : filteredProposals.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProposals.map((proposal, index) => (
                <ProposalCard key={proposal.id} proposal={proposal} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Map className="text-slate-500" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">暂无提案</h3>
              <p className="text-slate-400">该分类下暂无提案，成为第一个提交者吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
