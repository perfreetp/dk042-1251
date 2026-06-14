import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  PlusCircle,
  FileText,
  Target,
  Clock,
  Send,
  Lightbulb,
} from 'lucide-react';
import { useStore } from '../store/useStore.ts';
import { cn } from '../lib/utils.ts';

export default function SubmitProposal() {
  const navigate = useNavigate();
  const { user, createProposal, loading } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    useCase1: '',
    useCase2: '',
    useCase3: '',
    estimatedWork: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const estimatedWorkOptions = [
    '1 人周以内',
    '1-2 人周',
    '2-3 人周',
    '3-4 人周',
    '4-6 人周',
    '6-8 人周',
    '8 人周以上',
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = '请输入提案标题';
    if (!formData.description.trim()) newErrors.description = '请输入功能说明';
    if (!formData.useCase1.trim()) newErrors.useCase1 = '请至少填写一个使用案例';
    if (!formData.estimatedWork) newErrors.estimatedWork = '请选择预计工作量';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const useCases = [formData.useCase1, formData.useCase2, formData.useCase3].filter(Boolean);
    
    const proposal = await createProposal({
      title: formData.title.trim(),
      description: formData.description.trim(),
      useCases,
      estimatedWork: formData.estimatedWork,
    });

    setSubmitting(false);
    
    if (proposal) {
      navigate(`/proposal/${proposal.id}`);
    }
  };

  if (!user || user.type === 'visitor') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="text-slate-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">请先登录</h2>
          <p className="text-slate-400 mb-6">登录后即可提交新的功能提案</p>
          <button
            onClick={() => navigate('/')}
            className="text-sky-400 hover:text-sky-300"
          >
            返回首页并登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            返回路线图
          </button>

          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 md:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
                <PlusCircle className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">提交新提案</h1>
                <p className="text-slate-400 text-sm">分享您的想法，让社区一起投票决定</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                  <FileText size={16} className="text-sky-400" />
                  提案标题
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="简洁明了地描述您想要的功能"
                  className={cn(
                    'w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all',
                    errors.title
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500'
                  )}
                />
                {errors.title && (
                  <p className="text-rose-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                  <Target size={16} className="text-sky-400" />
                  功能说明
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="详细描述这个功能是什么，解决什么问题，为什么重要..."
                  rows={5}
                  className={cn(
                    'w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all resize-none',
                    errors.description
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500'
                  )}
                />
                {errors.description && (
                  <p className="text-rose-400 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white mb-4">
                  <Lightbulb size={16} className="text-amber-400" />
                  使用案例（至少 1 个）
                </label>
                <div className="space-y-3">
                  {['useCase1', 'useCase2', 'useCase3'].map((field, i) => (
                    <div key={field}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-6 h-6 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center text-xs font-medium">
                          {i + 1}
                        </span>
                        <span className="text-sm text-slate-400">
                          {i === 0 ? '案例 1（必填）' : `案例 ${i + 1}（选填）`}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formData[field as keyof typeof formData] as string}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        placeholder={`描述一个具体的使用场景，例如："当我需要处理大量数据时..."`}
                        className={cn(
                          'w-full px-4 py-2.5 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all',
                          i === 0 && errors.useCase1
                            ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                            : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500'
                        )}
                      />
                    </div>
                  ))}
                </div>
                {errors.useCase1 && (
                  <p className="text-rose-400 text-sm mt-1">{errors.useCase1}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                  <Clock size={16} className="text-amber-400" />
                  预计工作量
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {estimatedWorkOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, estimatedWork: option })}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-all border',
                        formData.estimatedWork === option
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                          : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-slate-600 hover:text-white'
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {errors.estimatedWork && (
                  <p className="text-rose-400 text-sm mt-2">{errors.estimatedWork}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl text-base font-semibold hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30"
                >
                  <Send size={18} />
                  {submitting ? '提交中...' : '提交提案'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
