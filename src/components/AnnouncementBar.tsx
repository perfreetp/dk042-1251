import { useState } from 'react';
import {
  Bell,
  Info,
  AlertTriangle,
  CheckCircle,
  Star,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useStore } from '../store/useStore.ts';
import { cn } from '../lib/utils.ts';
import type { AnnouncementType } from '../../shared/index.ts';

const typeConfig: Record<AnnouncementType, {
  icon: typeof Info;
  bg: string;
  border: string;
  text: string;
  iconBg: string;
}> = {
  info: {
    icon: Info,
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    text: 'text-sky-400',
    iconBg: 'bg-sky-500/20',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    iconBg: 'bg-amber-500/20',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20',
  },
  important: {
    icon: Star,
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    iconBg: 'bg-rose-500/20',
  },
};

export default function AnnouncementBar() {
  const { announcements } = useStore();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const visibleAnnouncements = announcements.filter(a => !dismissed.includes(a.id));

  if (visibleAnnouncements.length === 0) return null;

  const pinnedAnnouncements = visibleAnnouncements.filter(a => a.pinned);
  const otherAnnouncements = visibleAnnouncements.filter(a => !a.pinned);
  const displayAnnouncements = [...pinnedAnnouncements, ...otherAnnouncements];

  return (
    <div className="space-y-2 mb-6">
      {displayAnnouncements.map((announcement, index) => {
        const config = typeConfig[announcement.type];
        const Icon = config.icon;
        const isExpanded = expandedId === announcement.id;
        const isFirst = index === 0;

        return (
          <div
            key={announcement.id}
            className={cn(
              'relative rounded-xl border overflow-hidden transition-all duration-300',
              config.bg,
              config.border,
              announcement.pinned && 'ring-1 ring-offset-2 ring-offset-slate-950',
              announcement.type === 'important' && announcement.pinned && 'ring-rose-500/50'
            )}
          >
            {isFirst && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            )}

            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  config.iconBg
                )}>
                  <Icon size={16} className={config.text} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn(
                      'font-semibold text-sm',
                      config.text
                    )}>
                      {announcement.title}
                    </h4>
                    {announcement.pinned && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/10 text-white/70">
                        置顶
                      </span>
                    )}
                  </div>

                  <p className={cn(
                    'text-sm leading-relaxed',
                    isExpanded ? '' : 'line-clamp-2',
                    'text-slate-300'
                  )}>
                    {announcement.content}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">
                      {new Date(announcement.updatedAt).toLocaleDateString('zh-CN')}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : announcement.id)}
                        className="p-1 rounded hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                        title={isExpanded ? '收起' : '展开'}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      <button
                        onClick={() => setDismissed([...dismissed, announcement.id])}
                        className="p-1 rounded hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                        title="关闭"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
