import { useState } from 'react';
import { ArrowLeft, Loader2, Rocket } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

interface NewDeploymentPageProps {
    onStartDeploy: (config: DeploymentConfig) => void;
    onBack: () => void;
}

interface DeploymentConfig {
    serviceName: string;
    githubRepo: string;
    strategy: string;
    description: string;
}

export default function NewDeploymentPage({ onStartDeploy, onBack }: NewDeploymentPageProps) {
    const [formData, setFormData] = useState<DeploymentConfig>({
        serviceName: '',
        githubRepo: '',
        strategy: 'canary',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const { language } = useLanguage();
    const copy = {
        en: {
            back: 'Back to Dashboard',
            title: 'Start New Deployment',
            subtitle: 'Configure your deployment settings. The Gardener Agent will generate a deployment plan for review.',
            labels: {
                serviceName: 'Service Name *',
                repo: 'GitHub Repository URL *',
                strategy: 'Deployment Strategy *',
                description: 'Description',
            },
            placeholders: {
                service: 'e.g., demo-api',
                repo: 'e.g., https://github.com/username/repo',
                description: 'Describe the changes in this deployment...',
            },
            helper: 'This will trigger a GitHub Actions workflow to build and push your Docker image.',
            strategies: {
                canary: 'Canary Deployment (Recommended)',
                blueGreen: 'Blue-Green Deployment',
                rolling: 'Rolling Update',
            },
            submit: 'Start Deployment',
            submitting: 'Starting Deployment...',
            cancel: 'Cancel',
            info: 'ℹ️ How it works: After submitting, the Gardener Agent will generate a deployment plan, trigger GitHub Actions to build your image, and guide you through the deployment process with real-time monitoring.',
        },
        ja: {
            back: 'ダッシュボードへ戻る',
            title: '新しいデプロイを開始',
            subtitle: 'デプロイ設定を入力すると、ガーデナーエージェントが計画を生成してくれます。',
            labels: {
                serviceName: 'サービス名 *',
                repo: 'GitHub リポジトリ URL *',
                strategy: 'デプロイ戦略 *',
                description: '変更内容',
            },
            placeholders: {
                service: '例: demo-api',
                repo: '例: https://github.com/username/repo',
                description: 'このデプロイでの変更点を記入してください...',
            },
            helper: 'GitHub Actions を起動して Docker イメージをビルドし、プッシュします。',
            strategies: {
                canary: 'カナリアデプロイ（推奨）',
                blueGreen: 'ブルーグリーンデプロイ',
                rolling: 'ローリングアップデート',
            },
            submit: 'デプロイを開始',
            submitting: 'デプロイを開始しています...',
            cancel: 'キャンセル',
            info: 'ℹ️ 仕組み: 送信後、ガーデナーエージェントがデプロイ計画を作成し、GitHub Actions を実行してイメージをビルド、リアルタイムで進行を案内します。',
        },
    } as const;
    const t = copy[language];


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Pass config without version
            onStartDeploy(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-stone-50 p-8">
            <div className="mx-auto max-w-2xl">
                <button
                    onClick={onBack}
                    className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeft size={16} /> {t.back}
                </button>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.title}</h2>
                    <p className="text-slate-500 mb-8">{t.subtitle}</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                {t.labels.serviceName}
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.serviceName}
                                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 focus:border-green-500 focus:outline-none transition-all"
                                placeholder={t.placeholders.service}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                {t.labels.repo}
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.githubRepo}
                                onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 focus:border-green-500 focus:outline-none transition-all"
                                placeholder={t.placeholders.repo}
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                {t.helper}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                {t.labels.strategy}
                            </label>
                            <select
                                value={formData.strategy}
                                onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 focus:border-green-500 focus:outline-none transition-all"
                            >
                                <option value="canary">{t.strategies.canary}</option>
                                <option value="blue-green">{t.strategies.blueGreen}</option>
                                <option value="rolling">{t.strategies.rolling}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                {t.labels.description}
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 focus:border-green-500 focus:outline-none transition-all"
                                placeholder={t.placeholders.description}
                                rows={4}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-4 text-lg font-bold text-white shadow-lg transition-all
                  ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}
                `}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        {t.submitting}
                                    </>
                                ) : (
                                    <>
                                        <Rocket size={20} />
                                        {t.submit}
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onBack}
                                disabled={loading}
                                className="rounded-xl border-2 border-slate-200 px-8 py-4 text-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                {t.cancel}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
                    {t.info}
                </div>
            </div>
        </div>
    );
}
