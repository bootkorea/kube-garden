import { useState, useRef, useEffect } from 'react';
import { Play, CheckCircle, Loader2, ShieldCheck, Terminal, Activity, ArrowLeft, Check, Sprout, Trees, Flower2, Bot, Sparkles, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import confetti from 'canvas-confetti'; // celebratory confetti
import toast, { Toaster } from 'react-hot-toast'; // toast notifications
import { useLanguage } from '../components/LanguageContext';

// --- Helpers ---
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type LogMeta = {
  role: 'agent' | 'user' | 'system';
  text: string;
};

const parseLogEntry = (entry: string): LogMeta => {
  if (entry.startsWith('AI Agent:')) {
    return { role: 'agent', text: entry.replace('AI Agent:', '').trim() };
  }
  if (entry.startsWith('User:')) {
    return { role: 'user', text: entry.replace('User:', '').trim() };
  }
  return { role: 'system', text: entry };
};

// --- Visual components ---

// Plant growth animation
const GrowingPlant = ({ status, labels }: { status: string; labels: { idle: string; planning: string; running: string; success: string } }) => {
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
    scale = "scale-125";
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 transition-all duration-500">
      <div className={`flex h-24 w-24 items-center justify-center rounded-full border-4 border-white shadow-xl transition-all duration-500 ${color} ${scale}`}>
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <p className="mt-4 text-sm font-bold text-slate-500 transition-all">
        {status === 'idle' && labels.idle}
        {status === 'planning' && labels.planning}
        {status === 'running' && labels.running}
        {status === 'success' && labels.success}
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

const MetricsChart = ({ title }: { title: string }) => {
  const data = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    before: 100 + Math.random() * 20,
    after: i > 10 ? 80 + Math.random() * 10 : null,
  }));

  return (
    <div className="h-64 w-full rounded-xl bg-white p-4 shadow-sm border border-slate-100">
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h4>
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

// --- Main component ---
interface DeploymentConsoleProps {
  onBack: () => void;
  deploymentConfig: {
    serviceName: string;
    githubRepo: string;
    strategy: string;
    description: string;
    environment?: string; // Optional
  } | null;
}

export default function DeploymentConsole({ onBack, deploymentConfig }: DeploymentConsoleProps) {
  const { language } = useLanguage();
  const copy = {
    en: {
      headerPrefix: 'Deploying:',
      environment: 'Production Environment',
      strategyLabel: 'Strategy',
      strategyOptions: {
        canary: 'Canary Deployment (Recommended)',
        blue: 'Blue-Green Deployment',
      },
      plant: {
        idle: 'Ready to Grow',
        planning: 'Sprouting...',
        running: 'Blooming...',
        success: 'Fully Grown!',
      },
      timeline: {
        lint: 'Test & Lint',
        scan: 'Sec Scan',
        canary: 'Canary 10%',
      },
      buttons: {
        deploy: 'Deploy with Agent',
        processing: 'Processing...',
        ready: 'Deployment Ready',
        failed: 'Deployment Failed',
      },
      successPanel: {
        title: 'Deployment Successful',
        description: 'Traffic is currently split 10% (New) / 90% (Old). Metrics indicate stability.',
        promote: 'Promote to 100%',
        rollback: 'Rollback',
        chartTitle: 'Latency Comparison (ms)',
      },
      failedPanel: {
        title: 'Deployment Failed',
        description: 'The deployment process encountered an error. Please check the logs above for details.',
        retry: 'Try Again',
      },
      toast: {
        initializing: 'Initializing Deployment Agent...',
        planCreated: 'Plan Created! Running Tests.',
        securityClear: 'Security Clean. Rolling out Canary.',
        canaryLive: 'Canary Deployment Live!',
        failedStart: 'Deployment failed to start',
        failed: 'Deployment Failed',
        promoteSuccess: 'Successfully Promoted to 100%!',
        rollbackStart: 'Rolling back to previous version...',
        rollbackDone: 'Rollback Complete.',
      },
      logReady: "AI Agent: Ready to deploy. Click 'Deploy with Agent' to start.",
      userLabel: 'You',
      agentLabel: 'AI Agent',
    },
    ja: {
      headerPrefix: 'デプロイ中:',
      environment: '本番環境',
      strategyLabel: '戦略',
      strategyOptions: {
        canary: 'カナリアデプロイ（推奨）',
        blue: 'ブルーグリーンデプロイ',
      },
      plant: {
        idle: '成長の準備完了',
        planning: '芽が出ています...',
        running: '開花中...',
        success: '立派に成長しました！',
      },
      timeline: {
        lint: 'テスト & Lint',
        scan: 'セキュリティスキャン',
        canary: 'カナリア 10%',
      },
      buttons: {
        deploy: 'エージェントとデプロイ',
        processing: '処理中...',
        ready: 'デプロイ完了',
        failed: 'デプロイ失敗',
      },
      successPanel: {
        title: 'デプロイ成功',
        description: '現在のトラフィックは 新10% / 旧90% です。メトリクスは安定しています。',
        promote: '100% に切り替え',
        rollback: 'ロールバック',
        chartTitle: 'レイテンシ比較 (ms)',
      },
      failedPanel: {
        title: 'デプロイ失敗',
        description: 'デプロイ処理でエラーが発生しました。上部のログを確認してください。',
        retry: '再試行',
      },
      toast: {
        initializing: 'デプロイエージェントを初期化しています...',
        planCreated: '計画を作成しました。テストを実行中。',
        securityClear: 'セキュリティ検査クリア。カナリアを展開中。',
        canaryLive: 'カナリアデプロイが稼働中！',
        failedStart: 'デプロイ開始に失敗しました',
        failed: 'デプロイ失敗',
        promoteSuccess: '100% へ昇格しました！',
        rollbackStart: '前のバージョンへロールバックしています...',
        rollbackDone: 'ロールバック完了。',
      },
      logReady: "AI エージェント: デプロイ準備完了です。「エージェントとデプロイ」をクリックしてください。",
      userLabel: 'あなた',
      agentLabel: 'AI エージェント',
    },
  } as const;
  const t = copy[language];

  const serviceName = deploymentConfig?.serviceName || 'demo-api';
  const [status, setStatus] = useState<'idle' | 'planning' | 'running' | 'success' | 'failed'>('idle');
  const [logs, setLogs] = useState<string[]>([t.logReady]);
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleDeploy = async () => {
    if (status !== 'idle' || !deploymentConfig) return;

    // Toast: deployment initialized
    toast.loading(t.toast.initializing, { id: 'deploy-toast' });

    setStatus('planning');
    const version = 'latest'; // Default to latest since version control is removed
    setLogs(prev => [...prev, `User: Deploying ${deploymentConfig.serviceName}:${version} with ${deploymentConfig.strategy} strategy.`, "AI Agent: Analyzing... Generating deployment plan."]);

    try {
      // Step 1: Check if service exists, if not create it
      setLogs(prev => [...prev, "AI Agent: Checking if service exists..."]);

      const servicesResponse = await fetch(`${API_URL}/services`);
      if (!servicesResponse.ok) {
        const errorText = await servicesResponse.text();
        throw new Error(`Failed to fetch services: ${servicesResponse.status} - ${errorText}`);
      }

      const servicesData = await servicesResponse.json();
      const servicesList = Array.isArray(servicesData) ? servicesData : (servicesData.services || []);

      let service = servicesList.find((s: any) => s.name === deploymentConfig.serviceName);

      if (!service) {
        // Create the service
        setLogs(prev => [...prev, "AI Agent: Service not found. Creating new service..."]);

        const createResponse = await fetch(`${API_URL}/services`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: deploymentConfig.serviceName,
            gitUrl: deploymentConfig.githubRepo,
            gitBranch: 'main',
            namespace: 'default',
            criticality: 'medium',
          }),
        });

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          setLogs(prev => [...prev, `Error: Failed to create service - ${createResponse.status}: ${errorText}`]);
          throw new Error(`Failed to create service: ${createResponse.status} - ${errorText}`);
        }

        const createData = await createResponse.json();
        service = createData.service;
        setLogs(prev => [...prev, `AI Agent: Service created successfully with ID: ${service.id}`]);
      } else {
        setLogs(prev => [...prev, `AI Agent: Service found with ID: ${service.id}`]);
      }

      // Step 2: Start deployment with serviceId
      setLogs(prev => [...prev, "AI Agent: Starting deployment..."]);

      const response = await fetch(`${API_URL}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.id,
          environment: deploymentConfig.environment || 'production',
          description: deploymentConfig.description,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setLogs(prev => [...prev, `Error: Failed to start deployment - ${response.status}: ${errorText}`]);
        throw new Error(`Failed to start deployment: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const deploymentId = data.deployment?.id || data.deploymentId || data.id;
      setDeploymentId(deploymentId);

      setLogs(prev => [...prev, "AI Agent: Plan approved. Starting pipeline...", "Running Tests & Lint..."]);
      toast.success(t.toast.planCreated, { id: 'deploy-toast' });
      setStatus('running');

      // Poll for deployment status
      pollDeploymentStatus(deploymentId);

    } catch (error: any) {
      setStatus('failed');
      setLogs(prev => [...prev, `Error: ${error.message}`]);
      toast.error(t.toast.failedStart, { id: 'deploy-toast' });
      console.error('Deployment error:', error);
    }
  };

  const lastStatusRef = useRef<string | null>(null);

  const pollDeploymentStatus = async (id: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/deploy/${id}`);
        // If the request fails (e.g., 404 Not Found), keep polling until the record appears.
        if (!response.ok) {
          // Only stop on server errors (5xx). For 404, wait and retry.
          if (response.status >= 500) {
            console.error('Server error while polling deployment status:', response.status);
            return;
          }
          // 404 or other client errors: wait and retry.
          await sleep(2000);
          return checkStatus();
        }

        const data = await response.json();
        const deployment = data.deployment || data; // Handle both {deployment: {...}} and direct object
        const currentStatus = deployment.status;

        console.log('Poll response:', deployment);

        // Fallback: if error exists, treat as failed
        if (deployment.error && !currentStatus?.includes('SUCCESS') && !currentStatus?.includes('DEPLOYED')) {
          if (currentStatus !== lastStatusRef.current) {
            lastStatusRef.current = currentStatus;
            setStatus('failed');
            setLogs(prev => [...prev, `Deployment failed: ${deployment.error}`]);
            toast.error(t.toast.failed, { id: 'deploy-toast' });
            return;
          }
        }

        // Only update logs if status has changed
        // Check buildStatus as well since webhook updates it
        const effectiveStatus = (deployment.buildStatus === 'success' && currentStatus === 'BUILD_TRIGGERED')
          ? 'BUILD_COMPLETED'
          : currentStatus;

        if (effectiveStatus !== lastStatusRef.current) {
          lastStatusRef.current = effectiveStatus;

          if (effectiveStatus === 'BUILD_TRIGGERED') {
            setLogs(prev => [...prev, "Build triggered via GitHub Actions..."]);
          } else if (effectiveStatus === 'BUILD_COMPLETED') {
            setLogs(prev => [...prev, "Build completed successfully!", "Security Scan passed (Trivy).", "Rolling out canary deployment..."]);
            toast.success(t.toast.securityClear, { id: 'deploy-toast' });

            // Simulate deployment completion after 3 seconds
            await sleep(3000);
            setStatus('success');
            setLogs(prev => [...prev, "AI Agent: Deployment successful! Canary is live."]);
            toast.success(t.toast.canaryLive, { id: 'deploy-toast' });

            await sleep(1000);
            // Fire confetti
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
            });
            return; // Stop polling
          } else if (effectiveStatus === 'DEPLOYED_TO_EKS' || effectiveStatus === 'SUCCESS' || effectiveStatus === 'IMAGE_VALIDATED') {
            setStatus('success');
            setLogs(prev => [...prev, "AI Agent: Deployment successful! Canary is live."]);
            toast.success(t.toast.canaryLive, { id: 'deploy-toast' });

            await sleep(1000);
            // Fire confetti
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
            });
            return; // Stop polling
          } else if (effectiveStatus && effectiveStatus.includes('FAILED')) {
            setStatus('failed');
            setLogs(prev => [...prev, `Deployment failed: ${deployment.error || 'Unknown error'}`]);
            toast.error(t.toast.failed, { id: 'deploy-toast' });
            return; // Stop polling
          }
        }

        // Continue polling
        await sleep(3000);
        checkStatus();
      } catch (error) {
        console.error('Error polling deployment status:', error);
      }
    };

    checkStatus();
  };

  const handlePromote = async () => {
    if (!deploymentId) return;

    setLogs(prev => [...prev, "User: Confirmed. Promoting to 100%...", "AI Agent: Sending promotion command..."]);

    try {
      const response = await fetch(`${API_URL}/deploy/${deploymentId}/promote`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to promote deployment');
      }

      setLogs(prev => [...prev, "AI Agent: Promotion triggered. Traffic split updating to 100% New. 🚀"]);

      // Fire celebratory confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
      });
      toast.success(t.toast.promoteSuccess, { duration: 4000, icon: '🎉' });

      // Status will be updated by polling
    } catch (error) {
      console.error('Promotion error:', error);
      toast.error('Failed to promote deployment');
      setLogs(prev => [...prev, "Error: Failed to trigger promotion."]);
    }
  };

  const handleRollback = async () => {
    if (!deploymentId) return;

    setLogs(prev => [...prev, "User: Rollback requested.", "AI Agent: Initiating rollback sequence..."]);

    try {
      const response = await fetch(`${API_URL}/deploy/${deploymentId}/rollback`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to rollback deployment');
      }

      setLogs(prev => [...prev, "AI Agent: Rollback triggered. Reverting traffic to stable version."]);
      toast.success(t.toast.rollbackDone);

      // Status will be updated by polling
    } catch (error) {
      console.error('Rollback error:', error);
      toast.error('Failed to rollback deployment');
      setLogs(prev => [...prev, "Error: Failed to trigger rollback."]);
    }
  };

  const isProcessing = status === 'planning' || status === 'running';
  const isSuccess = status === 'success';
  const isFailed = status === 'failed';

  return (
    <div className="flex h-full w-full overflow-hidden bg-stone-50">
      {/* Toast container */}
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
            <h2 className="text-xl font-bold text-slate-800">{`${t.headerPrefix} ${serviceName}`}</h2>
            <p className="text-xs text-slate-400">{t.environment}</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            {/* Animated plant visualization */}
            <GrowingPlant status={status} labels={t.plant} />

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">{t.strategyLabel}</label>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 focus:border-green-500 focus:outline-none transition-all">
                <option>{t.strategyOptions.canary}</option>
                <option>{t.strategyOptions.blue}</option>
              </select>
            </div>

            <button
              onClick={handleDeploy}
              disabled={status !== 'idle'}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-lg font-bold text-white shadow-lg transition-all active:scale-95 
                      ${status === 'idle' ? 'bg-green-600 shadow-green-200 hover:bg-green-700' : ''}
                      ${isProcessing ? 'bg-slate-400 shadow-none cursor-not-allowed' : ''}
                      ${isSuccess ? 'bg-green-800 shadow-none cursor-not-allowed' : ''}
                      ${isFailed ? 'bg-red-600 shadow-none cursor-not-allowed' : ''}
                    `}
            >
              {status === 'idle' && <><Play size={20} /> {t.buttons.deploy}</>}
              {isProcessing && <><Loader2 className="animate-spin" /> {t.buttons.processing}</>}
              {isSuccess && <><Check size={20} /> {t.buttons.ready}</>}
              {isFailed && <><AlertCircle size={20} /> {t.buttons.failed}</>}
            </button>

            {/* Timeline Status */}
            {status !== 'idle' && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-6 border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between gap-2">
                  <TimelineStep icon={Terminal} label={t.timeline.lint} status={status === 'planning' ? 'running' : 'done'} />
                  <div className="mt-4 h-0.5 flex-1 bg-slate-200"></div>
                  <TimelineStep icon={ShieldCheck} label={t.timeline.scan} status={status === 'running' ? 'running' : (status === 'success' ? 'done' : 'pending')} />
                  <div className="mt-4 h-0.5 flex-1 bg-slate-200"></div>
                  <TimelineStep icon={Activity} label={t.timeline.canary} status={status === 'success' ? 'done' : (status === 'running' ? 'pending' : 'pending')} />
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
            {logs.map((log, idx) => {
              const meta = parseLogEntry(log);
              const isAgent = meta.role === 'agent';
              const isUser = meta.role === 'user';
              const alignment = isUser ? 'justify-end' : 'justify-start';
              const rowDirection = isUser ? 'flex-row-reverse text-right' : '';
              const bubbleBase = 'max-w-[85%] rounded-3xl px-5 py-4 text-sm shadow-sm animate-in slide-in-from-bottom-2';
              const bubbleStyles = isUser
                ? 'bg-slate-900 text-white rounded-tr-none'
                : isAgent
                  ? 'bg-white text-slate-800 rounded-tl-none border border-emerald-100'
                  : 'bg-white text-slate-600 rounded-tl-none border border-slate-100';

              return (
                <div key={idx} className={`flex ${alignment}`}>
                  <div className={`flex items-start gap-3 ${rowDirection}`}>
                    {isAgent && (
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-inner shadow-emerald-100">
                        <Bot size={20} strokeWidth={1.5} />
                        <span className="absolute -bottom-1 -right-1 text-lg" role="img" aria-label="garden spark">
                          🌼
                        </span>
                      </div>
                    )}
                    <div className={`${bubbleBase} ${bubbleStyles}`}>
                      {(isAgent || isUser) && (
                        <span
                          className={`mb-2 inline-flex items-center gap-1 text-xs font-semibold ${isAgent ? 'text-emerald-600' : 'text-slate-300'}`}
                        >
                          {isAgent && <Sparkles size={12} />}
                          {isAgent ? t.agentLabel : t.userLabel}
                        </span>
                      )}
                      <p>{meta.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>
        </div>

        {isSuccess && (
          <div className="border-t border-slate-200 bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-full duration-500">
            <div className="mb-4 flex items-center gap-2 text-green-700 font-bold text-lg">
              <CheckCircle size={24} /> {t.successPanel.title}
            </div>

            <div className="flex gap-6">
              <div className="w-1/2">
                <MetricsChart title={t.successPanel.chartTitle} />
              </div>
              <div className="w-1/2 flex flex-col justify-center gap-3">
                <p className="text-sm text-slate-500">{t.successPanel.description}</p>
                <div className="flex gap-3">
                  <button
                    onClick={handlePromote}
                    className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 shadow-md shadow-green-100 transition-colors"
                  >
                    {t.successPanel.promote}
                  </button>
                  <button
                    onClick={handleRollback}
                    className="flex-1 rounded-xl bg-white border-2 border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-red-500 hover:border-red-200 transition-colors"
                  >
                    {t.successPanel.rollback}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isFailed && (
          <div className="border-t border-red-200 bg-red-50 p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-full duration-500">
            <div className="mb-4 flex items-center gap-2 text-red-700 font-bold text-lg">
              <AlertCircle size={24} /> {t.failedPanel.title}
            </div>
            <p className="text-sm text-red-600 mb-4">
              {t.failedPanel.description}
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 shadow-md shadow-red-100 transition-colors"
            >
              {t.failedPanel.retry}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}