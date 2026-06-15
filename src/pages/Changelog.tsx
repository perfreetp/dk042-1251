import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Calendar,
  GitMerge,
  ThumbsUp,
  User,
  ChevronDown,
  ChevronRight,
  Eye,
  LayoutGrid,
  List,
} from 'lucide-react';
import type { ChangelogEntryWithProposals, ProposalStatus } from '../../shared/index.ts';
import { STATUS_LABELS, STATUS_COLORS } from '../../shared/index.ts';
import { api } from '../services/api.ts';
import { cn } from '../lib/utils.ts';

type ViewMode = 'flat' | 'grouped';
type GroupKey = string;

interface GroupedChangelogs {
  key: GroupKey;
  label: string;
  entries: ChangelogEntryWithProposals[];
  totalVotes: number;
  completedCount: number;
}

export default function Changelog() {
  const [changelogs, setChangelogs] = useState<ChangelogEntryWithProposals[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grouped');
  const [expandedGroups, setExpandedGroups] = useState<Set<GroupKey>>(new Set());
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchChangelogs = async () => {
      try {
        const response = await api.getChangelogs();
        setChangelogs(response.data);
      } catch (err) {
        console.error('Failed to fetch changelogs:', err);
      }
      setLoading(false);
    };
    fetchChangelogs();
  }, []);

  const getQuarterKey = (dateStr: string): GroupKey => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    return `${year}-Q${quarter}`;
  };

  const getQuarterLabel = (key: GroupKey): string => {
    const [year, quarter] = key.split('-');
    const quarterNames: Record<string, string> = {
      'Q1': '第一季度（1-3月）',
      'Q2': '第二季度（4-6月）',
      'Q3': '第三季度（7-9月）',
      'Q4': '第四季度（10-12月）',
    };
    return `${year} 年 ${quarterNames[quarter] || quarter}`;
  };

  const grouped = useMemo<GroupedChangelogs[]>(() => {
    const groupsMap = new Map<GroupKey, ChangelogEntryWithProposals[]>();
    changelogs.forEach(entry => {
      const key = getQuarterKey(entry.releasedAt);
      if (!groupsMap.has(key)) {
        groupsMap.set(key, []);
      }
      groupsMap.get(key)!.push(entry);
    });

    const sortedKeys = Array.from(groupsMap.keys()).sort().reverse();
    return sortedKeys.map(key => {
      const entries = groupsMap.get(key)!.sort(
        (a, b) => new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime()
      );
      return {
        key,
        label: getQuarterLabel(key),
        entries,
        totalVotes: entries.reduce(
          (sum, e) => sum + (e.relatedProposalDetails?.reduce((s, p) => s + (p.votes || 0), 0) || 0),
          0
        ),
        completedCount: entries.filter(e => e.status === 'completed').length,
      };
    });
  }, [changelogs]);

  useEffect(() => {
    if (viewMode === 'grouped' && grouped.length > 0 && expandedGroups.size === 0) {
      setExpandedGroups(new Set([grouped[0].key]));
    }
  }, [viewMode, grouped]);

  const toggleGroup = (key: GroupKey) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleEntry = (id: string) => {
    setExpandedEntries(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    if (viewMode === 'grouped') {
      setExpandedGroups(new Set(grouped.map(g => g.key)));
    }
    setExpandedEntries(new Set(changelogs.map(c => c.id)));
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
    setExpandedEntries(new Set());
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const statusConfig = {
    completed: {
      label: '已完成',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
    },
    partial: {
      label: '部分完成',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    rejected: {
      label: '暂不考虑',
      icon: AlertCircle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
    },
  };

  const renderChangelogEntry = (entry: ChangelogEntryWithProposals, index: number) => {
    const config = statusConfig[entry.status];
    const StatusIcon = config.icon;
    const isLeft = index % 2 === 0;
    const isExpanded = expandedEntries.has(entry.id);

    return (
      <div
        key={entry.id}
        className={cn(
          'relative md:grid md:grid-cols-2 md:gap-8 items-start',
        )}
      >
        <div className="absolute left-4 md:left-1/2 w-8 h-8 -translate-x-1/2 rounded-full bg-slate-900 border-2 border-sky-500/50 flex items-center justify-center z-10">
          <div className="w-3 h-3 rounded-full bg-sky-500" />
        </div>

        <div className={cn(
          'pl-12 md:pl-0',
          isLeft ? 'md:text-right md:pr-8' : 'md:col-start-2 md:pl-8'
        )}>
          <div
            className={cn(
              'bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600 transition-all overflow-hidden',
            )}
          >
            <div
              className="cursor-pointer"
              onClick={() => toggleEntry(entry.id)}
            >
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-sm font-semibold border border-sky-500/20 font-mono">
                  {entry.version}
                </span>
                <span className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                  config.bg, config.color, config.border
                )}>
                  <StatusIcon size={12} />
                  {config.label}
                </span>
                <span className="text-slate-500 text-sm flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(entry.releasedAt)}
                </span>
                {isExpanded ? (
                  <ChevronDown size={16} className="text-slate-500 ml-auto" />
                ) : (
                  <ChevronRight size={16} className="text-slate-500 ml-auto" />
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {entry.title}
              </h3>
              <p className="text-slate-300 leading-relaxed line-clamp-2">
                {entry.description}
              </p>

              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                {entry.relatedProposalDetails && entry.relatedProposalDetails.length > 0 && (
                  <span className="flex items-center gap-1">
                    <GitMerge size={12} />
                    {entry.relatedProposalDetails.length} 个关联提案
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <ThumbsUp size={12} />
                  {(entry.relatedProposalDetails || []).reduce((s, p) => s + (p.votes || 0), 0)} 票关联
                </span>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-5 pt-5 border-t border-slate-700/30">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 mb-4">
                  <div className="flex items-start gap-2">
                    <GitMerge size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-300 mb-1">
                        决策说明
                      </p>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {entry.decisions}
                      </p>
                    </div>
                  </div>
                </div>

                {entry.relatedProposalDetails && entry.relatedProposalDetails.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Eye size={12} />
                        关联提案（发布时快照）
                      </p>
                      <span className="text-[10px] text-slate-600">数据已固定，不随当前状态变化</span>
                    </div>
                    <div className="space-y-3">
                      {entry.relatedProposalDetails.map((proposal) => (
                        <Link
                          key={proposal.id}
                          to={`/proposal/${proposal.id}`}
                          className="block p-4 bg-slate-900/50 rounded-lg hover:bg-slate-800/50 border border-slate-700/30 hover:border-slate-600/50 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className={cn(
                                  'px-2 py-0.5 rounded text-[10px] font-medium border',
                                  STATUS_COLORS[proposal.status as ProposalStatus]
                                )}>
                                  {STATUS_LABELS[proposal.status as ProposalStatus]}
                                </span>
                                <span className="text-xs text-slate-500 font-mono">
                                  {proposal.id}
                                </span>
                              </div>
                              <h4 className="text-sm font-medium text-white truncate group-hover:text-sky-400 transition-colors">
                                {proposal.title}
                              </h4>
                            </div>
                            <ExternalLink size={12} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-slate-400 mb-3 flex-wrap">
                            <span className="flex items-center gap-1">
                              <ThumbsUp size={11} className="text-sky-400" />
                              <span className="font-mono">{proposal.votes} 票</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye size={11} className="text-amber-400" />
                              <span>{proposal.watchers || 0} 关注</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <User size={11} className="text-emerald-400" />
                              <span>{proposal.author || '未知'}</span>
                            </span>
                          </div>

                          {proposal.decisionNote && (
                            <div className="pt-3 border-t border-slate-700/30">
                              <p className="text-[11px] text-slate-500 mb-1">取舍结论：</p>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                {proposal.decisionNote}
                              </p>
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 mb-4 shadow-lg shadow-emerald-500/25">
              <GitBranch className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">路线图回顾</h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              项目的每一次迭代与决策，所有数据均为发布时快照，历史不漂移
            </p>
          </div>

          {!loading && changelogs.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                <button
                  onClick={() => setViewMode('grouped')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    viewMode === 'grouped'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  <LayoutGrid size={14} />
                  按季度分组
                </button>
                <button
                  onClick={() => setViewMode('flat')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    viewMode === 'flat'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  <List size={14} />
                  全部展开
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={expandAll}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  全部展开
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  全部收起
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 bg-slate-800 rounded w-1/3 mb-4" />
                  <div className="h-32 bg-slate-800/50 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-sky-500/50 via-slate-700 to-transparent" />

              {viewMode === 'grouped' ? (
                <div className="space-y-10">
                  {grouped.map((group) => {
                    const isGroupExpanded = expandedGroups.has(group.key);
                    return (
                      <div key={group.key}>
                        <button
                          onClick={() => toggleGroup(group.key)}
                          className={cn(
                            'relative z-20 w-full flex items-center gap-3 p-4 bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all text-left',
                          )}
                        >
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                            isGroupExpanded
                              ? 'bg-sky-500/20 text-sky-400'
                              : 'bg-slate-700/50 text-slate-400'
                          )}>
                            {isGroupExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white">
                              {group.label}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-slate-400">
                              <span>{group.entries.length} 次发布</span>
                              <span>·</span>
                              <span>{group.completedCount} 项完整完成</span>
                              <span>·</span>
                              <span>关联 {group.totalVotes} 票</span>
                            </div>
                          </div>
                        </button>

                        <div className={cn(
                          'space-y-12 mt-8 overflow-hidden transition-all duration-300',
                          isGroupExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
                        )}>
                          {group.entries.map((entry, index) => renderChangelogEntry(entry, index))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-12">
                  {changelogs.map((entry, index) => renderChangelogEntry(entry, index))}
                </div>
              )}

              {changelogs.length === 0 && (
                <div className="text-center py-16 pl-12 md:pl-0">
                  <GitBranch className="text-slate-600 mx-auto mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-white mb-2">暂无更新日志</h3>
                  <p className="text-slate-400">敬请期待项目的第一次发布</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
