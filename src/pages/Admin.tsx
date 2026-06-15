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
  Bell,
  Info,
  AlertTriangle,
  Star,
  ToggleLeft,
  ToggleRight,
  Edit,
} from 'lucide-react';
import type { Proposal, ProposalStatus, VotingCycle, Announcement, AnnouncementType } from '../../shared/index.ts';
import { api } from '../services/api.ts';
import { STATUS_LABELS } from '../../shared/index.ts';
import { cn } from '../lib/utils.ts';

type TabType = 'overview' | 'proposals' | 'cycles' | 'changelog' | 'announcements';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<any>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [cycles, setCycles] = useState<VotingCycle[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const [mergeTarget, setMergeTarget] = useState<string>('');
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

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

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'info' as AnnouncementType,
    pinned: false,
    scope: 'all' as 'all' | 'home' | 'proposal_detail',
    effectiveAt: '',
    expiresAt: '',
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
      const [statsRes, proposalsRes, cyclesRes, announcementsRes] = await Promise.all([
        api.getAdminStats(),
        api.getProposals({ sortBy: 'votes' }),
        api.getVotingCycles(),
        api.getAdminAnnouncements(),
      ]);
      setStats(statsRes.data);
      setProposals(proposalsRes.data.proposals);
      setCycles(cyclesRes.data);
      setAnnouncements(announcementsRes.data);
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

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        await api.updateAnnouncement({
          id: editingAnnouncement.id,
          ...newAnnouncement,
        });
      } else {
        await api.createAnnouncement(newAnnouncement);
      }
      setNewAnnouncement({ title: '', content: '', type: 'info', pinned: false, scope: 'all', effectiveAt: '', expiresAt: '' });
      setShowAnnouncementForm(false);
      setEditingAnnouncement(null);
      loadData();
    } catch (err) {
      console.error('Failed to create/update announcement:', err);
    }
  };

  const handleToggleAnnouncementActive = async (id: string, active: boolean) => {
    try {
      await api.updateAnnouncement({ id, active });
      setAnnouncements(prev => prev.map(a =>
        a.id === id ? { ...a, active } : a
      ));
    } catch (err) {
      console.error('Failed to toggle announcement:', err);
    }
  };

  const handleToggleAnnouncementPinned = async (id: string, pinned: boolean) => {
    try {
      await api.updateAnnouncement({ id, pinned });
      setAnnouncements(prev => prev.map(a =>
        a.id === id ? { ...a, pinned } : a
      ));
    } catch (err) {
      console.error('Failed to pin announcement:', err);
    }
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      pinned: announcement.pinned,
      scope: announcement.scope,
      effectiveAt: announcement.effectiveAt || '',
      expiresAt: announcement.expiresAt || '',
    });
    setShowAnnouncementForm(true);
  };

  const tabs = [
    { id: 'overview', label: '概览', icon: BarChart3 },
    { id: 'proposals', label: '提案管理', icon: FileText },
    { id: 'announcements', label: '公告管理', icon: Bell },
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

          {activeTab === 'announcements' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">公告管理</h2>
                <button
                  onClick={() => {
                    setEditingAnnouncement(null);
                    setNewAnnouncement({ title: '', content: '', type: 'info', pinned: false, scope: 'all', effectiveAt: '', expiresAt: '' });
                    setShowAnnouncementForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500/10 text-sky-400 rounded-lg text-sm font-medium hover:bg-sky-500/20 transition-colors"
                >
                  <PlusCircle size={16} />
                  发布公告
                </button>
              </div>

              {showAnnouncementForm && (
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Bell size={18} className="text-sky-400" />
                    {editingAnnouncement ? '编辑公告' : '发布新公告'}
                  </h3>
                  <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">标题</label>
                      <input
                        type="text"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        placeholder="公告标题"
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">内容</label>
                      <textarea
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                        rows={4}
                        placeholder="公告详细内容..."
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">类型</label>
                        <select
                          value={newAnnouncement.type}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value as AnnouncementType })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
                        >
                          <option value="info">信息</option>
                          <option value="warning">警告</option>
                          <option value="success">成功</option>
                          <option value="important">重要</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">展示范围</label>
                        <select
                          value={newAnnouncement.scope}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, scope: e.target.value as 'all' | 'home' | 'proposal_detail' })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
                        >
                          <option value="all">全部页面</option>
                          <option value="home">仅首页</option>
                          <option value="proposal_detail">仅提案详情</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">
                          生效时间 <span className="text-slate-600">(可选)</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={newAnnouncement.effectiveAt}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, effectiveAt: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">
                          失效时间 <span className="text-slate-600">(可选)</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={newAnnouncement.expiresAt}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiresAt: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newAnnouncement.pinned}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, pinned: e.target.checked })}
                          className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-sky-500 focus:ring-sky-500"
                        />
                        <span className="text-sm text-slate-400">置顶公告</span>
                      </label>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-medium hover:from-sky-400 hover:to-blue-500 transition-all"
                      >
                        {editingAnnouncement ? '保存修改' : '发布公告'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAnnouncementForm(false);
                          setEditingAnnouncement(null);
                        }}
                        className="px-6 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-12 text-center">
                    <Bell size={40} className="text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">暂无公告</p>
                  </div>
                ) : (
                  announcements.map((announcement) => {
                    const typeConfig = {
                      info: { icon: Info, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
                      warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                      success: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                      important: { icon: Star, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
                    }[announcement.type];
                    const TypeIcon = typeConfig.icon;

                    return (
                      <div
                        key={announcement.id}
                        className={cn(
                          'bg-slate-800/50 rounded-2xl border p-5 transition-all',
                          announcement.active ? typeConfig.border : 'border-slate-700/50 opacity-60'
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={cn('p-2 rounded-xl', typeConfig.bg)}>
                              <TypeIcon size={20} className={typeConfig.color} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-semibold text-white">{announcement.title}</h4>
                                {announcement.pinned && (
                                  <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-medium rounded flex items-center gap-1">
                                    <Pin size={10} />
                                    置顶
                                  </span>
                                )}
                                {!announcement.active && (
                                  <span className="px-1.5 py-0.5 bg-slate-600/50 text-slate-400 text-[10px] font-medium rounded">
                                    已下线
                                  </span>
                                )}
                                <span className="px-1.5 py-0.5 bg-sky-500/10 text-sky-400 text-[10px] font-medium rounded">
                                  {announcement.scope === 'all' ? '全部页面' : announcement.scope === 'home' ? '仅首页' : '仅详情'}
                                </span>
                              </div>
                              <p className="text-slate-400 text-sm mb-2 line-clamp-2">{announcement.content}</p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                <span>发布于 {new Date(announcement.createdAt).toLocaleDateString('zh-CN')}</span>
                                {announcement.effectiveAt && (
                                  <span className="text-emerald-400">
                                    生效: {new Date(announcement.effectiveAt).toLocaleDateString('zh-CN')}
                                  </span>
                                )}
                                {announcement.expiresAt && (
                                  <span className="text-amber-400">
                                    失效: {new Date(announcement.expiresAt).toLocaleDateString('zh-CN')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditAnnouncement(announcement)}
                              className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
                              title="编辑"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleAnnouncementPinned(announcement.id, !announcement.pinned)}
                              className={cn(
                                'p-2 rounded-lg transition-colors',
                                announcement.pinned
                                  ? 'text-amber-400 bg-amber-500/10'
                                  : 'text-slate-500 hover:text-amber-400 hover:bg-slate-700'
                              )}
                              title={announcement.pinned ? '取消置顶' : '置顶'}
                            >
                              <Pin size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleAnnouncementActive(announcement.id, !announcement.active)}
                              className={cn(
                                'p-2 rounded-lg transition-colors',
                                announcement.active
                                  ? 'text-emerald-400'
                                  : 'text-slate-500 hover:text-slate-400'
                              )}
                              title={announcement.active ? '下线公告' : '上线公告'}
                            >
                              {announcement.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
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
