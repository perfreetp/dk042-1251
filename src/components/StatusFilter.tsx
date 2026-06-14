import { ProposalStatus } from '../../shared/index.ts';
import { useStore } from '../store/useStore.ts';
import { cn } from '../lib/utils.ts';

const filters: { value: ProposalStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'planning', label: '规划中' },
  { value: 'voting', label: '投票中' },
  { value: 'developing', label: '开发中' },
  { value: 'completed', label: '已完成' },
  { value: 'rejected', label: '暂不考虑' },
];

export const StatusFilter = () => {
  const { statusFilter, setStatusFilter } = useStore();

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => setStatusFilter(filter.value)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            statusFilter === filter.value
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
              : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
