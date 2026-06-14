import { SortBy } from '../../shared/index.ts';
import { useStore } from '../store/useStore.ts';
import { cn } from '../lib/utils.ts';
import { TrendingUp, Clock, Flame } from 'lucide-react';

const sortOptions: { value: SortBy; label: string; icon: typeof TrendingUp }[] = [
  { value: 'votes', label: '热度', icon: Flame },
  { value: 'recent', label: '近期增长', icon: TrendingUp },
  { value: 'newest', label: '最新发布', icon: Clock },
];

export const SortSelector = () => {
  const { sortBy, setSortBy } = useStore();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-400">排序：</span>
      <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSortBy(option.value)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
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
    </div>
  );
};
