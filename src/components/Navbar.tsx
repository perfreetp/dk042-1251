import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Map,
  Trophy,
  GitBranch,
  Settings,
  PlusCircle,
  LogIn,
  LogOut,
  ChevronDown,
  User,
  Shield,
} from 'lucide-react';
import { useStore } from '../store/useStore.ts';

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, logout, setUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: '路线图', icon: Map },
    { path: '/ranking', label: '排行榜', icon: Trophy },
    { path: '/changelog', label: '更新日志', icon: GitBranch },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogin = async (userId: string) => {
    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    if (data.success) {
      setUser(data.data);
      setShowLoginModal(false);
    }
  };

  const mockUsers = [
    { id: 'u1', name: '张开源', role: '维护者' },
    { id: 'u2', name: '李贡献', role: '用户' },
    { id: 'u3', name: '王开发者', role: '用户' },
    { id: 'u4', name: '赵测试', role: '用户' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold text-white hidden sm:block">
                  FeatureVote
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? 'bg-sky-500/10 text-sky-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user && user.type !== 'visitor' && (
                <Link
                  to="/submit"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-sky-400 hover:to-blue-500 transition-all hover:shadow-lg hover:shadow-sky-500/25"
                >
                  <PlusCircle size={18} />
                  <span className="hidden sm:inline">提交提案</span>
                </Link>
              )}

              {user && user.type === 'maintainer' && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/admin')
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Settings size={18} />
                  <span className="hidden sm:inline">后台</span>
                </Link>
              )}

              {user && user.type !== 'visitor' ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <ChevronDown size={16} className="text-slate-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl border border-slate-700 shadow-xl py-2 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-700">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          {user.type === 'maintainer' ? (
                            <><Shield size={12} className="text-emerald-400" /> 维护者</>
                          ) : (
                            <><User size={12} /> 社区用户</>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700"
                      >
                        <LogOut size={16} />
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  <LogIn size={18} />
                  登录
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-2">选择身份登录</h3>
            <p className="text-slate-400 text-sm mb-6">
              为了演示，您可以选择以下任一身份登录体验不同功能
            </p>
            <div className="space-y-3">
              {mockUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleLogin(u.id)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-left group"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`}
                    alt={u.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium group-hover:text-sky-400 transition-colors">
                      {u.name}
                    </p>
                    <p className="text-sm text-slate-400">{u.role}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-6 w-full py-2.5 text-slate-400 hover:text-white transition-colors text-sm"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
