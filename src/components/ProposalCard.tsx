import { Link } from 'react-router-dom';
import {
  ThumbsUp,
  Eye,
  Clock,
  User,
  Pin,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import type { Proposal } from '../../shared/index.ts';
import { STATUS_LABELS, STATUS_COLORS } from '../../shared/index.ts';
import { useStore } from '../store/useStore.ts';
import { cn } from '../lib/utils.ts';

interface ProposalCardProps {
  proposal: Proposal;
  index?: number;
  showRank?: boolean;
}

export const ProposalCard = ({ proposal, index, showRank = false }: ProposalCardProps) => {
  const { vote, unvote, user } = useStore();
  const maxVotes = 500;
  const progress = Math.min((proposal.votes / maxVotes) * 100, 100);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || user.type === 'visitor') return;
    await vote(proposal.id);
  };

  const handleUnvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || user.type === 'visitor') return;
    await unvote(proposal.id);
  };

  const rankColors = [
    'from-amber-400 to-yellow-600',
    'from-slate-300 to-slate-500',
    'from-amber-600 to-amber-800',
  ];

  return (
    <Link
      to={`/proposal/${proposal.id}`}
      className="group block relative bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700/50 hover:border-sky-500/30 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1 overflow-hidden"
    >
      {proposal.pinned && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg flex items-center gap-1">
          <Pin size={12} />
          置顶
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {showRank && index !== undefined && index < 3 && (
              <div
                className={cn(
                  'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center font-bold text-white text-lg shadow-lg',
                  rankColors[index]
                )}
              >
                {index + 1}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-sky-400 transition-colors line-clamp-2">
                {proposal.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    STATUS_COLORS[proposal.status]
                  )}
                >
                  {STATUS_LABELS[proposal.status]}
                </span>
                {proposal.recentVotes > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                    <TrendingUp size={12} />
                    +{proposal.recentVotes}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {proposal.watchers}
              </span>
            </div>
          </div>
        </div>

        <p className="text-slate-400 text-sm line-clamp-2 mb-4">
          {proposal.description}
        </p>

        <div className="space-y-3">
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <img
                  src={proposal.author.avatar}
                  alt={proposal.author.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-xs text-slate-400">
                  {proposal.author.name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={12} />
                {proposal.estimatedWork}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleVote}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  proposal.status === 'completed' || proposal.status === 'rejected'
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:scale-105 active:scale-95'
                )}
                disabled={proposal.status === 'completed' || proposal.status === 'rejected' || !user || user.type === 'visitor'}
              >
                <ThumbsUp size={14} />
                <span className="font-mono">{proposal.votes}</span>
              </button>

              <ChevronRight
                size={18}
                className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
