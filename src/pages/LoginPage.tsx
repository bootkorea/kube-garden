import { useState } from 'react';
import { KeyRound, ArrowRight } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { language } = useLanguage();
  const [accessToken, setAccessToken] = useState('');
  const copy = {
    en: {
      tagline: 'Enter your access token to manage your digital garden.',
      accessToken: 'Access Token',
      placeholder: 'ghp_xxxxxxxxxxxx',
      button: 'Enter Garden',
      footer: 'Designed by term2 Bear Team @ Softbank Hackathon',
    },
    ja: {
      tagline: 'デジタルガーデンを管理するにはアクセストークンを入力してください。',
      accessToken: 'アクセストークン',
      placeholder: '例: ghp_xxxxxxxxxxxx',
      button: 'ガーデンに入る',
      footer: 'Softbank Hackathon term2 Bear Team 制作',
    },
  } as const;
  const t = copy[language];

  const handleLogin = () => {
    if (accessToken.trim()) {
      localStorage.setItem('githubToken', accessToken.trim());
      onLogin();
    }
  };

  return (
    // Force the layout to occupy the full viewport
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-stone-50">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-stone-200/50">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <KeyRound size={32} />
          </div>
          <h1 className="font-logo text-3xl font-bold text-slate-800">Kube Garden</h1>
          <p className="mt-2 text-slate-500">{t.tagline}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">{t.accessToken}</label>
            <input 
              type="password" 
              placeholder={t.placeholder}
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 focus:border-green-500 focus:outline-none transition-all"
            />
          </div>
          
          <button 
            onClick={handleLogin}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-green-600 hover:shadow-lg hover:shadow-green-200"
          >
            {t.button} <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-400">
          {t.footer}
        </p>
      </div>
    </div>
  );
}