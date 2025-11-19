import { KeyRound, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  return (
    // [수정] w-screen h-screen overflow-hidden으로 화면 전체 강제 고정
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-stone-50">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-stone-200/50">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <KeyRound size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Kube-Garden</h1>
          <p className="mt-2 text-slate-500">Enter your access token to manage your digital garden.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Access Token</label>
            <input 
              type="password" 
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 focus:border-green-500 focus:outline-none transition-all"
            />
          </div>
          
          <button 
            onClick={onLogin}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-green-600 hover:shadow-lg hover:shadow-green-200"
          >
            Enter Garden <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-400">
          Powered by AI Deployment Agent & Argo Rollouts
        </p>
      </div>
    </div>
  );
}