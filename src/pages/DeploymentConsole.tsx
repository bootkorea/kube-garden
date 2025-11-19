import { useState, useRef, useEffect } from 'react';
import { Play, CheckCircle, Loader2, ShieldCheck, Terminal, Activity, ArrowLeft, Check, Sprout, Trees, Flower2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import confetti from 'canvas-confetti'; // 폭죽 효과
import toast, { Toaster } from 'react-hot-toast'; // 토스트 알림

// --- 1. 헬퍼 함수 ---
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- 2. 내부 컴포넌트 ---

// [NEW] 식물 성장 애니메이션 컴포넌트
const GrowingPlant = ({ status }: { status: string }) => {
  // 상태에 따라 아이콘과 색상 변경
  let Icon = Sprout;
  let color = "text-slate-300 bg-slate-100";
  let scale = "scale-100";

  if (status === 'planning') {
    Icon = Sprout;
    color = "text-green-500 bg-green-100 animate-pulse";
    scale = "scale-110";
  } else if (status === 'running') {
    Icon = Flower2;
    color = "text-green-600 bg-green-100 animate-bounce";
    scale = "scale-125";
  } else if (status === 'success') {
    Icon = Trees;
    color = "text-green-700 bg-green-200";
    scale = "scale-150";
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 transition-all duration-500">
      <div className={`flex h-24 w-24 items-center justify-center rounded-full border-4 border-white shadow-xl transition-all duration-500 ${color} ${scale}`}>
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <p className="mt-4 text-sm font-bold text-slate-500 transition-all">
        {status === 'idle' && "Ready to Grow"}
        {status === 'planning' && "Sprouting..."}
        {status === 'running' && "Blooming..."}
        {status === 'success' && "Fully Grown!"}
      </p>
    </div>
  );
};

const TimelineStep = ({ icon: Icon, label, status }: { icon: any, label: string, status: 'pending' | 'running' | 'done' }) => {
  const getColors = () => {
    if (status === 'done') return 'text-green-600 bg-green-100 border-green-200';
    if (status === 'running') return 'text-blue-600 bg-blue-50 border-blue-200 animate-pulse';
    return 'text-slate-300 bg-slate-50 border-slate-100';
  };

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${getColors()}`}>
        {status === 'running' ? <Loader2 className="animate-spin" size={18} /> : <Icon size={18} />}
      </div>
      <span className={`text-xs font-medium text-center ${status === 'pending' ? 'text-slate-400' : 'text-slate-700'}`}>
        {label}
      </span>
    </div>
  );
};

const MetricsChart = () => {
  const data = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    before: 100 + Math.random() * 20,
    after: i > 10 ? 80 + Math.random() * 10 : null, 
  }));

  return (
    <div className="h-64 w-full rounded-xl bg-white p-4 shadow-sm border border-slate-100">
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Latency Comparison (ms)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          <Line type="monotone" dataKey="before" stroke="#cbd5e1" strokeDasharray="5 5" strokeWidth={2} dot={false} name="v1.0 (Old)" />
          <Line type="monotone" dataKey="after" stroke="#10b981" strokeWidth={3} dot={false} name="v1.1 (New)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- 3. 메인 페이지 컴포넌트 ---

interface DeploymentConsoleProps {
  onBack: () => void;
}

export default function DeploymentConsole({ onBack }: DeploymentConsoleProps) {
  const [status, setStatus] = useState<'idle' | 'planning' | 'running' | 'success'>('idle');
  const [logs, setLogs] = useState<string[]>(["AI Agent: Ready to deploy. Describe your changes."]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleDeploy = async () => {
    if (status !== 'idle') return;

    // [Event] 시작 토스트
    toast.loading('Initializing Deployment Agent...', { id: 'deploy-toast' });

    setStatus('planning');
    setLogs(prev => [...prev, "User: Deploying v1.1 with Canary strategy.", "AI Agent: Analyzing... Generating deployment plan."]);
    
    await sleep(1000); 

    // [Event] 단계 변경
    toast.success('Plan Created! Running Tests.', { id: 'deploy-toast' });
    setStatus('running');
    setLogs(prev => [...prev, "AI Agent: Plan approved. Starting pipeline...", "Running Tests & Lint..."]);
    
    await sleep(1500); 

    // [Event] 보안 스캔 완료
    toast.success('Security Clean. Rolling out Canary.', { id: 'deploy-toast' });
    setLogs(prev => [...prev, "Security Scan passed (Trivy).", "Rolling out 10% traffic (Argo Rollouts)..."]);
    
    await sleep(1500); 

    // [Event] 성공
    toast.success('Canary Deployment Live!', { id: 'deploy-toast' });
    setStatus('success');
    setLogs(prev => [...prev, "AI Agent: Metrics collected. Latency improved by 15%. Promotion recommended."]);
  };

  const handlePromote = async () => {
    setLogs(prev => [...prev, "User: Confirmed. Promoting to 100%.", "AI Agent: Traffic split updated (100% New). Deployment Finalized. 🚀"]);
    
    await sleep(1000);
    
    // [Event] 화려한 폭죽 효과 (Confetti)
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
    });
    toast.success('Successfully Promoted to 100%!', { duration: 4000, icon: '🎉' });

    await sleep(2000);
    setStatus('idle'); 
    setLogs(["AI Agent: Ready for next deployment."]);
  };

  const handleRollback = async () => {
    setLogs(prev => [...prev, "User: Rollback requested.", "AI Agent: Reverting traffic to stable version... Done."]);
    toast.error('Rolling back to previous version...');
    
    await sleep(1500);
    toast.success('Rollback Complete.');
    
    setStatus('idle'); 
    setLogs(["AI Agent: Ready for next deployment."]);
  };

  const isProcessing = status === 'planning' || status === 'running';
  const isSuccess = status === 'success';

  return (
    <div className="flex h-full w-full overflow-hidden bg-stone-50">
      {/* [NEW] 토스트 컨테이너 추가 */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Left Panel */}
      <div className="flex w-1/2 flex-col border-r border-slate-200 bg-white">
        <header className="flex items-center gap-4 border-b border-slate-100 p-6">
          <button 
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
             <h2 className="text-xl font-bold text-slate-800">Deploying: demo-api</h2>
             <p className="text-xs text-slate-400">Production Environment</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
            <div className="space-y-6">
                {/* [NEW] 성장하는 식물 애니메이션 위치 */}
                <GrowingPlant status={status} />

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Strategy</label>
                    <select className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 focus:border-green-500 focus:outline-none transition-all">
                    <option>Canary Deployment (Recommended)</option>
                    <option>Blue-Green Deployment</option>
                    </select>
                </div>
                
                <button 
                    onClick={handleDeploy}
                    disabled={status !== 'idle'}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-lg font-bold text-white shadow-lg transition-all active:scale-95 
                      ${status === 'idle' ? 'bg-green-600 shadow-green-200 hover:bg-green-700' : ''}
                      ${isProcessing ? 'bg-slate-400 shadow-none cursor-not-allowed' : ''}
                      ${isSuccess ? 'bg-green-800 shadow-none cursor-not-allowed' : ''}
                    `}
                >
                    {status === 'idle' && <><Play size={20} /> Deploy with Agent</>}
                    {isProcessing && <><Loader2 className="animate-spin" /> Processing...</>}
                    {isSuccess && <><Check size={20} /> Deployment Ready</>}
                </button>

                {/* Timeline Status */}
                {status !== 'idle' && (
                <div className="mt-4 rounded-2xl bg-slate-50 p-6 border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between gap-2">
                        <TimelineStep icon={Terminal} label="Test & Lint" status={status === 'planning' ? 'running' : 'done'} />
                        <div className="mt-4 h-0.5 flex-1 bg-slate-200"></div>
                        <TimelineStep icon={ShieldCheck} label="Sec Scan" status={status === 'running' ? 'running' : (status === 'success' ? 'done' : 'pending')} />
                        <div className="mt-4 h-0.5 flex-1 bg-slate-200"></div>
                        <TimelineStep icon={Activity} label="Canary 10%" status={status === 'success' ? 'done' : (status === 'running' ? 'pending' : 'pending')} />
                    </div>
                </div>
                )}
            </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-1/2 flex-col bg-stone-100">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col gap-4">
            {logs.map((log, idx) => (
                <div key={idx} className={`flex ${log.startsWith("User") ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm shadow-sm animate-in slide-in-from-bottom-2
                    ${log.startsWith("User") 
                        ? "bg-slate-800 text-white rounded-tr-none" 
                        : "bg-white text-slate-700 rounded-tl-none border border-slate-100"}`}>
                    {log}
                </div>
                </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>

        {isSuccess && (
          <div className="border-t border-slate-200 bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-full duration-500">
             <div className="mb-4 flex items-center gap-2 text-green-700 font-bold text-lg">
                <CheckCircle size={24} /> Deployment Successful
             </div>
             
             <div className="flex gap-6">
                 <div className="w-1/2">
                     <MetricsChart />
                 </div>
                 <div className="w-1/2 flex flex-col justify-center gap-3">
                    <p className="text-sm text-slate-500">Traffic is currently split <b>10% (New) / 90% (Old)</b>. Metrics indicate stability.</p>
                    <div className="flex gap-3">
                        <button 
                          onClick={handlePromote}
                          className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 shadow-md shadow-green-100 transition-colors"
                        >
                        Promote to 100%
                        </button>
                        <button 
                          onClick={handleRollback}
                          className="flex-1 rounded-xl bg-white border-2 border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-red-500 hover:border-red-200 transition-colors"
                        >
                        Rollback
                        </button>
                    </div>
                 </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}