import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ThumbsUp,
  Eye,
  EyeOff,
  Share2,
  MessageSquare,
  Clock,
  User,
  Calendar,
  ArrowLeft,
  Send,
  Target,
  Briefcase,
  TrendingUp,
  Pin,
  GitMerge,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../store/useStore.ts';
import { STATUS_LABELS, STATUS_COLORS } from '../../shared/index.ts';
import { cn } from '../lib/utils.ts';
import AnnouncementBar from '../components/AnnouncementBar.tsx';

export default function ProposalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProposal, proposals, loading, fetchProposal, fetchAnnouncements, vote, unvote, toggleWatch, addComment, user } = useStore();
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProposal(id);
      fetchAnnouncements('proposal_detail');
    }
  }, [id, fetchProposal, fetchAnnouncements]);

  const handleVote = async () => {
    if (!id || !user || user.type === 'visitor') return;
    if (currentProposal?.hasVoted) {
      await unvote(id);
    } else {
      await vote(id);
    }
  };

  const handleWatch = async () => {
    if (!id || !user || user.type === 'visitor') return;
    await toggleWatch(id);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !comment.trim() || !user || user.type === 'visitor') return;
    
    setSubmittingComment(true);
    const success = await addComment(id, comment.trim());
    if (success) {
      setComment('');
    }
    setSubmittingComment(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-800 rounded w-1/4" />
            <div className="h-10 bg-slate-800 rounded w-3/4" />
            <div className="h-32 bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentProposal) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">提案不存在</h2>
          <button
            onClick={() => navigate('/')}
            className="text-sky-400 hover:text-sky-300"
          >
            返回路线图
          </button>
        </div>
      </div>
    );
  }

  const maxVotes = 500;
  const progress = Math.min((currentProposal.votes / maxVotes) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            返回路线图
          </button>

          <AnnouncementBar />

          {currentProposal.mergedTo && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <GitMerge size={16} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-amber-400 font-medium text-sm mb-1">
                    该提案已合并
                  </p>
                  <p className="text-slate-300 text-sm mb-3">
                    此提案已合并到主提案，您的投票和关注已自动计入。
                  </p>
                  <Link
                    to={`/proposal/${currentProposal.mergedTo}`}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sky-400 text-xs font-mono">
                          {currentProposal.mergedTo}
                        </span>
                        <span className="text-sm text-white font-medium truncate group-hover:text-sky-400 transition-colors">
                          {currentProposal.mergedToTitle || '主提案'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">点击查看主提案详情</p>
                    </div>
                    <ExternalLink size={12} className="text-slate-500 group-hover:text-sky-400 transition-colors" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
                      STATUS_COLORS[currentProposal.status]
                    )}
                  >
                    {STATUS_LABELS[currentProposal.status]}
                  </span>
                  {currentProposal.pinned && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium border border-amber-500/20">
                      <Pin size={14} />
                      置顶
                    </span>
                  )}
                  {currentProposal.recentVotes > 0 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                      <TrendingUp size={14} />
                      近期 +{currentProposal.recentVotes}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {currentProposal.title}
                </h1>

                <div className="flex items-center gap-6 text-sm text-slate-400 mb-6 pb-6 border-b border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <img
                      src={currentProposal.author.avatar}
                      alt={currentProposal.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{currentProposal.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(currentProposal.createdAt)}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Target size={18} className="text-sky-400" />
                      功能说明
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {currentProposal.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Briefcase size={18} className="text-amber-400" />
                      适用场景
                    </h3>
                    <ul className="space-y-2">
                      {currentProposal.useCases.map((uc, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300">
                          <span className="w-6 h-6 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {uc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <Clock size={20} className="text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-400">预计工作量</p>
                      <p className="text-white font-medium">{currentProposal.estimatedWork}</p>
                    </div>
                  </div>

                  {currentProposal.mergedFrom && currentProposal.mergedFrom.length > 0 && (
                    <div className="p-4 bg-sky-500/5 rounded-xl border border-sky-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <GitMerge size={16} className="text-sky-400" />
                          <h4 className="font-medium text-sky-400 text-sm">合并来源</h4>
                        </div>
                        <span className="text-xs text-slate-500">
                          共 {currentProposal.mergedFrom.length} 个提案并入
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-4">
                        以下为合并时的完整审计记录，可清晰追溯每次合并的处理人、原因和数据变化
                      </p>
                      <div className="space-y-4">
                        {currentProposal.mergedFrom.map((source) => (
                          <div
                            key={source.proposalId}
                            className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30 transition-all"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="text-sky-400 text-xs font-mono">{source.proposalId}</span>
                                  <span className="text-xs text-slate-500">
                                    {new Date(source.mergedAt).toLocaleString('zh-CN', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                                <Link
                                  to={`/proposal/${source.proposalId}`}
                                  className="text-sm font-medium text-white truncate hover:text-sky-400 transition-colors inline-flex items-center gap-1 group"
                                >
                                  {source.title}
                                  <ExternalLink size={12} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs mb-4 pb-4 border-b border-slate-700/30">
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <ThumbsUp size={12} className="text-sky-400" />
                                <span>原始 {source.originalVotes} 票</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Eye size={12} className="text-amber-400" />
                                <span>{source.originalWatchers} 关注</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <MessageSquare size={12} className="text-emerald-400" />
                                <span>{source.originalComments} 评论</span>
                              </div>
                            </div>

                            {source.mergeReason && (
                              <div className="mb-3">
                                <p className="text-[11px] text-slate-500 mb-1">合并原因：</p>
                                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/30 px-3 py-2 rounded-md">
                                  {source.mergeReason}
                                </p>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                              {source.mergedByName && (
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <User size={12} className="text-sky-400" />
                                  <span>处理人：{source.mergedByName}</span>
                                </div>
                              )}
                              {source.targetVotesBefore !== undefined && source.targetVotesAfter !== undefined && (
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <TrendingUp size={12} className="text-emerald-400" />
                                  <span>
                                    票数变化：{source.targetVotesBefore} → {source.targetVotesAfter}
                                    <span className="text-emerald-400 ml-1">
                                      (+{source.targetVotesAfter - source.targetVotesBefore})
                                    </span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 md:p-8">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <MessageSquare size={18} className="text-sky-400" />
                  评论区 ({currentProposal.comments.length})
                </h3>

                {user && user.type !== 'visitor' ? (
                  <form onSubmit={handleSubmitComment} className="mb-6">
                    <div className="flex gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="分享您的想法..."
                          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none transition-all"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            type="submit"
                            disabled={!comment.trim() || submittingComment}
                            className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Send size={14} />
                            发表评论
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="mb-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
                    <p className="text-slate-400 text-sm">请先登录后发表评论</p>
                  </div>
                )}

                <div className="space-y-4">
                  {currentProposal.comments.length > 0 ? (
                    currentProposal.comments.map((c) => (
                      <div key={c.id} className="flex gap-3">
                        <img
                          src={c.user.avatar}
                          alt={c.user.name}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium text-sm">
                              {c.user.name}
                            </span>
                            <span className="text-slate-500 text-xs">
                              {formatDate(c.createdAt)}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm">{c.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="text-slate-600 mx-auto mb-2" size={32} />
                      <p className="text-slate-500 text-sm">暂无评论，来发表第一条评论吧</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-white mb-2 font-mono">
                    {currentProposal.votes}
                  </div>
                  <p className="text-slate-400 text-sm">社区投票</p>
                </div>

                <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden mb-6">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleVote}
                    disabled={
                      currentProposal.status === 'completed' ||
                      currentProposal.status === 'rejected' ||
                      !user ||
                      user.type === 'visitor'
                    }
                    className={cn(
                      'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-base font-semibold transition-all',
                      currentProposal.hasVoted
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                        : currentProposal.status === 'completed' || currentProposal.status === 'rejected'
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98]'
                    )}
                  >
                    <ThumbsUp size={18} />
                    {currentProposal.hasVoted ? '已投票，点击撤回' : '投上一票'}
                  </button>

                  <button
                    onClick={handleWatch}
                    disabled={!user || user.type === 'visitor'}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-base font-medium transition-all border',
                      currentProposal.isWatching
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    )}
                  >
                    {currentProposal.isWatching ? (
                      <><Eye size={18} /> 已关注</>
                    ) : (
                      <><EyeOff size={18} /> 关注提案</>
                    )}
                    <span className="text-sm">({currentProposal.watchers})</span>
                  </button>

                  <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-base font-medium transition-all border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                    <Share2 size={18} />
                    分享
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
