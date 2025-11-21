import { useState } from 'react';
import { ArrowLeft, Loader2, Rocket } from 'lucide-react';

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
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Start New Deployment</h2>
                    <p className="text-slate-500 mb-8">Configure your deployment settings. The AI agent will generate a deployment plan for review.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Service Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.serviceName}
                                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 focus:border-green-500 focus:outline-none transition-all"
                                placeholder="e.g., demo-api"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                GitHub Repository Link *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.githubRepo}
                                onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 focus:border-green-500 focus:outline-none transition-all"
                                placeholder="e.g., https://github.com/username/repo or username/repo"
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                This will trigger a GitHub Actions workflow to build and push your Docker image.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Deployment Strategy *
                            </label>
                            <select
                                value={formData.strategy}
                                onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 focus:border-green-500 focus:outline-none transition-all"
                            >
                                <option value="canary">Canary Deployment (Recommended)</option>
                                <option value="blue-green">Blue-Green Deployment</option>
                                <option value="rolling">Rolling Update</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 focus:border-green-500 focus:outline-none transition-all"
                                placeholder="Describe the changes in this deployment..."
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
                                        Starting Deployment...
                                    </>
                                ) : (
                                    <>
                                        <Rocket size={20} />
                                        Start Deployment
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onBack}
                                disabled={loading}
                                className="rounded-xl border-2 border-slate-200 px-8 py-4 text-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
                    <strong>ℹ️ How it works:</strong> After submitting, the AI agent will generate a deployment plan, trigger GitHub Actions to build your image, and guide you through the deployment process with real-time monitoring.
                </div>
            </div>
        </div>
    );
}
