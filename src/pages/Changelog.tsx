import { useEffect, useState } from 'react';
import {
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Calendar,
  GitMerge,
} from 'lucide-react';
import type { ChangelogEntry } from '../../shared/index.ts';
import { api } from '../services/api.ts';
import { cn } from '../lib/utils.ts';

export default function Changelog() {
  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 mb-4 shadow-lg shadow-emerald-500/25">
              <GitBranch className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">更新日志</h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              了解项目的每一次迭代，以及背后的决策原因
            </p>
          </div>

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

              <div className="space-y-12">
                {changelogs.map((entry, index) => {
                  const config = statusConfig[entry.status];
                  const StatusIcon = config.icon;
                  const isLeft = index % 2 === 0;

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
                        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 hover:border-slate-700 transition-all">
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
                          </div>

                          <h3 className="text-xl font-bold text-white mb-2">
                            {entry.title}
                          </h3>
                          <p className="text-slate-300 mb-4 leading-relaxed">
                            {entry.description}
                          </p>

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

                          {entry.relatedProposals.length > 0 && (
                            <div>
                              <p className="text-xs text-slate-500 mb-2">关联提案：</p>
                              <div className="flex flex-wrap gap-2">
                                {entry.relatedProposals.map((pId) => (
                                  <a
                                    key={pId}
                                    href={`/proposal/${pId}`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-700/50 text-slate-300 text-xs hover:bg-slate-700 hover:text-white transition-colors"
                                  >
                                    <ExternalLink size={10} />
                                    {pId}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {changelogs.length === 0 && (
                  <div className="text-center py-16 pl-12 md:pl-0">
                    <GitBranch className="text-slate-600 mx-auto mb-4" size={48} />
                    <h3 className="text-xl font-semibold text-white mb-2">暂无更新日志</h3>
                    <p className="text-slate-400">敬请期待项目的第一次发布</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
