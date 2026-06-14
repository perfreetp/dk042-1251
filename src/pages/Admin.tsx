import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Shield,
  BarChart3,
  FileText,
  Pin,
  GitMerge,
  Calendar,
  PlusCircle,
  Check,
  X,
  TrendingUp,
  Users,
  Sparkles,
  CheckCircle2,
  Send,
} from 'lucide-react';
import type { Proposal, ProposalStatus, VotingCycle } from '../../shared/index.ts';
import { api } from '../services/api.ts';
import { STATUS_LABELS } from '../../shared/index.ts';
import { cn } from '../lib/utils.ts';

type TabType = 'overview' | 'proposals' | 'cycles' | 'changelog';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<any>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [cycles, setCycles] = useState<VotingCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const [mergeTarget, setMergeTarget] = useState<string>('');
  const [showMergeModal, setShowMergeModal] = useState(false);

  const [newCycle, setNewCycle] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const [newChangelog, setNewChangelog] = useState({
    version: '',
    title: '',
    description: '',
    decisions: '',
    relatedProposals: '' as string,
    status: 'completed' as 'completed' | 'partial' | 'rejected',
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId !== 'u1') {
      navigate('/');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, proposalsRes, cyclesRes] = await Promise.all([
        api.getAdminStats(),
        api.getProposals({ sortBy: 'votes' }),
        api.getVotingCycles(),
      ]);
      setStats(statsRes.data);
      setProposals(proposalsRes.data.proposals);
      setCycles(cyclesRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (proposalId: string, status: ProposalStatus) => {
    try {
      await api.updateProposalStatus(proposalId, status);
      setProposals(prev => prev.map(p =>
        p.id === proposalId ? { ...p, status } : p
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handlePinProposal = async (proposalId: string, pinned: boolean) => {
    try {
      await api.pinProposal(proposalId, pinned);
      setProposals(prev => prev.map(p =>
        p.id === proposalId ? { ...p, pinned } : p
      ));
    } catch (err) {
      console.error('Failed to pin proposal:', err);
    }
  };

  const handleMergeProposals = async () => {
    if (!mergeTarget || selectedProposals.length === 0) return;
    try {
      await api.mergeProposals(mergeTarget, selectedProposals);
      setSelectedProposals([]);
      setMergeTarget('');
      setShowMergeModal(false);
      loadData();
    } catch (err) {
      console.error('Failed to merge proposals:', err);
    }
  };

  const handleCreateCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createVotingCycle(newCycle);
      setNewCycle({ name: '', startDate: '', endDate: '', description: '' });
      loadData();
    } catch (err) {
      console.error('Failed to create cycle:', err);
    }
  };

  const handleCreateChangelog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const related = newChangelog.relatedProposals.split(',').map(s => s.trim()).filter(Boolean);
      await api.createChangelog({
        ...newChangelog,
        relatedProposals: related,
      });
      setNewChangelog({
        version: '',
        title: '',
        description: '',
        decisions: '',
        relatedProposals: '',
        status: 'completed',
      });
    } catch (err) {
      console.error('Failed to create changelog:', err);
    }
  };

  const toggleSelectProposal = (id: string) => {
    setSelectedProposals(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const tabs = [
    { id: 'overview', label: '概览', icon: BarChart3 },
    { id: 'proposals', label: '提案管理', icon: FileText },
    { id: 'cycles', label: '投票周期', icon: Calendar },
    { id: 'changelog', label: '发布日志', icon: Send },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-800 rounded w-1/4" />
            <div className="grid md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-800 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Shield className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">维护者后台</h1>
              <p className="text-slate-400 text-sm">管理提案、设置投票周期、发布更新日志</p>
            </div>
          </div>

          <div className="flex gap-1 mb-8 bg-slate-800/50 rounded-xl p-1 border border-slate-700/50 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && stats && (
            <div>
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                    <Sparkles size={14} />
                    总提案数
                  </div>
                  <div className="text-3xl font-bold text-white font-mono">
                    {stats.totalProposals}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                    <TrendingUp size={14} />
                    总投票数
                  </div>
                  <div className="text-3xl font-bold text-sky-400 font-mono">
                    {stats.totalVotes.toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                    <CheckCircle2 size={14} />
                    已完成
                  </div>
                  <div className="text-3xl font-bold text-emerald-400 font-mono">
                    {stats.completedProposals}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                    <Users size={14} />
                    日志数
                  </div>
                  <div className="text-3xl font-bold text-amber-400 font-mono">
                    {stats.totalChangelogs}
                  </div>
                </div>
              </div>

              {stats.activeCycle && (
                <div className="bg-gradient-to-r from-sky-900/20 to-blue-900/20 rounded-2xl border border-sky-500/20 p-6">
                  <div className="flex items-center gap-2 text-sky-400 text-sm font-medium mb-2">
                    <Calendar size={16} />
                    当前活跃投票周期
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{stats.activeCycle.name}</h3>
                  <p className="text-slate-400 text-sm">{stats.activeCycle.description}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'proposals' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">提案列表</h2>
                {selectedProposals.length > 0 && (
                  <button
                    onClick={() => setShowMergeModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-500/20 transition-colors"
                  >
                    <GitMerge size={16} />
                    合并选中 ({selectedProposals.length})
                  </button>
                )}
              </div>

              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">
                        <input
                          type="checkbox"
                          checked={selectedProposals.length === proposals.length && proposals.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProposals(proposals.map(p => p.id));
                            } else {
                              setSelectedProposals([]);
                            }
                          }}
                          className="rounded border-slate-600 bg-slate-900"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">提案</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">状态</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">票数</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {proposals.map((proposal) => (
                      <tr key={proposal.id} className="hover:bg-slate-800/30">
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedProposals.includes(proposal.id)}
                            onChange={() => toggleSelectProposal(proposal.id)}
                            className="rounded border-slate-600 bg-slate-900"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {proposal.pinned && <Pin size={14} className="text-amber-400" />}
                            <div>
                              <p className="text-white font-medium text-sm">{proposal.title}</p>
                              <p className="text-slate-500 text-xs">@{proposal.author.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={proposal.status}
                            onChange={(e) => handleUpdateStatus(proposal.id, e.target.value as ProposalStatus)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-sky-500"
                          >
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4 text-white font-mono text-sm">{proposal.votes}</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handlePinProposal(proposal.id, !proposal.pinned)}
                            className={cn(
                              'p-1.5 rounded-lg transition-colors',
                              proposal.pinned
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'text-slate-500 hover:text-amber-400 hover:bg-slate-700'
                            )}
                          >
                            <Pin size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'cycles' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <PlusCircle size={18} className="text-emerald-400" />
                  创建新投票周期
                </h3>
                <form onSubmit={handleCreateCycle} className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">名称</label>
                    <input
                      type="text"
                      value={newCycle.name}
                      onChange={(e) => setNewCycle({ ...newCycle, name: e.target.value })}
                      placeholder="例如：2026 Q3 路线图投票"
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">开始日期</label>
                      <input
                        type="date"
                        value={newCycle.startDate}
                        onChange={(e) => setNewCycle({ ...newCycle, startDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">结束日期</label>
                      <input
                        type="date"
                        value={newCycle.endDate}
                        onChange={(e) => setNewCycle({ ...newCycle, endDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">描述</label>
                    <textarea
                      value={newCycle.description}
                      onChange={(e) => setNewCycle({ ...newCycle, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-400 hover:to-teal-500 transition-all"
                  >
                    创建投票周期
                  </button>
                </form>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">历史投票周期</h3>
                <div className="space-y-3">
                  {cycles.map((cycle) => (
                    <div
                      key={cycle.id}
                      className={cn(
                        'bg-slate-800/50 rounded-xl border p-4',
                        cycle.isActive
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : 'border-slate-700/50'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{cycle.name}</h4>
                        {cycle.isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                            进行中
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mb-2">{cycle.description}</p>
                      <p className="text-slate-500 text-xs">
                        {cycle.startDate.split('T')[0]} ~ {cycle.endDate.split('T')[0]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'changelog' && (
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 max-w-2xl">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Send size={18} className="text-sky-400" />
                发布更新日志
              </h3>
              <form onSubmit={handleCreateChangelog} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">版本号</label>
                    <input
                      type="text"
                      value={newChangelog.version}
                      onChange={(e) => setNewChangelog({ ...newChangelog, version: e.target.value })}
                      placeholder="例如：v2.5.0"
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">状态</label>
                    <select
                      value={newChangelog.status}
                      onChange={(e) => setNewChangelog({ ...newChangelog, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="completed">已完成</option>
                      <option value="partial">部分完成</option>
                      <option value="rejected">暂不考虑</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">标题</label>
                  <input
                    type="text"
                    value={newChangelog.title}
                    onChange={(e) => setNewChangelog({ ...newChangelog, title: e.target.value })}
                    placeholder="简洁描述本次更新的主要内容"
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">更新描述</label>
                  <textarea
                    value={newChangelog.description}
                    onChange={(e) => setNewChangelog({ ...newChangelog, description: e.target.value })}
                    rows={3}
                    placeholder="详细描述本次更新包含的内容..."
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">决策说明（取舍原因）</label>
                  <textarea
                    value={newChangelog.decisions}
                    onChange={(e) => setNewChangelog({ ...newChangelog, decisions: e.target.value })}
                    rows={3}
                    placeholder="向社区说明为什么选择这些功能，以及其他提案的取舍原因..."
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">关联提案 ID（逗号分隔）</label>
                  <input
                    type="text"
                    value={newChangelog.relatedProposals}
                    onChange={(e) => setNewChangelog({ ...newChangelog, relatedProposals: e.target.value })}
                    placeholder="例如：p1, p3, p5"
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-400 hover:to-blue-500 transition-all shadow-lg shadow-sky-500/25"
                >
                  发布更新日志
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {showMergeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-2">合并提案</h3>
            <p className="text-slate-400 text-sm mb-4">
              将选中的 {selectedProposals.length} 个提案合并到目标提案中
            </p>
            
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">选择目标提案</label>
              <select
                value={mergeTarget}
                onChange={(e) => setMergeTarget(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
              >
                <option value="">请选择...</option>
                {proposals.filter(p => selectedProposals.includes(p.id)).map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowMergeModal(false);
                  setSelectedProposals([]);
                  setMergeTarget('');
                }}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleMergeProposals}
                disabled={!mergeTarget}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-50"
              >
                确认合并
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
