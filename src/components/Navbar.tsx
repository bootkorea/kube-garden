import { Sprout, History, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: any) => void;
  onLogout: () => void;
}

export default function Navbar({ currentPage, onNavigate, onLogout }: NavbarProps) {
  const { language } = useLanguage();
  const copy = {
    en: {
      dashboard: 'Dashboard',
      history: 'History',
      settings: 'Settings',
      logout: 'Logout',
    },
    ja: {
      dashboard: 'ダッシュボード',
      history: '履歴',
      settings: '設定',
      logout: 'ログアウト',
    },
  } as const;
  const t = copy[language];

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'history', label: t.history, icon: History },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <nav className="flex h-16 items-center justify-between bg-white px-6 border-b border-slate-200 shrink-0">
      {/* Logo Area */}
      <div
        className="flex items-center gap-2 cursor-pointer hover:opacity-80"
        onClick={() => onNavigate('dashboard')}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
          <Sprout size={20} />
        </div>
        <span className="text-2xl text-slate-800 font-logo font-bold">Kube Garden</span>
      </div>

      {/* Menu Links */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ring-2 ring-transparent hover:ring-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-100
              ${currentPage === item.id
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-500 transition-colors"
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">{t.logout}</span>
      </button>
    </nav>
  );
}