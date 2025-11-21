import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, GitCommit, Loader2, Trash2 } from 'lucide-react';

interface DeploymentRecord {
  id: string;
  serviceId: string;
  imageTag: string;
  status: string;
  strategy: string;
  environment: string;
  createdAt: number;
  description?: string;
  error?: string;
}

export default function HistoryPage() {
  const [deployments, setDeployments] = useState<DeploymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const USE_MOCK = !API_URL || API_URL === 'mock';

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    if (USE_MOCK) {
      // Mock data fallback
      const mockData = [
        { id: '103', serviceId: 'demo-api', imageTag: 'v1.1.0', status: 'SUCCESS', strategy: 'canary', environment: 'production', createdAt: Date.now() - 1000 * 60, description: 'Performance improved by 15%' },
        { id: '102', serviceId: 'demo-frontend', imageTag: 'v2.1.0', status: 'SUCCESS', strategy: 'blue-green', environment: 'production', createdAt: Date.now() - 86400000, description: 'UI update' },
        { id: '101', serviceId: 'demo-api', imageTag: 'v1.0.9', status: 'BUILD_FAILED', strategy: 'canary', environment: 'production', createdAt: Date.now() - 259200000, description: 'Failed due to unit test error', error: 'Build error' },
      ];
      setDeployments(mockData);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/deployments`);
      if (!response.ok) throw new Error('Failed to fetch deployments');
      const data = await response.json();
      setDeployments(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deploymentId: string) => {
    if (!confirm('Are you sure you want to delete this deployment?')) return;

    if (USE_MOCK) {
      setDeployments(deployments.filter(d => d.id !== deploymentId));
      return;
    }

    try {
      const response = await fetch(`${API_URL}/deployments/${deploymentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete deployment');

      // Remove from local state
      setDeployments(deployments.filter(d => d.id !== deploymentId));
    } catch (err: any) {
      alert(`Error deleting deployment: ${err.message}`);
    }
  };

  const getStatusDisplay = (record: DeploymentRecord) => {
    const isFailed = record.status.includes('FAILED') || record.error;
    const isSuccess = record.status === 'SUCCESS' || record.status === 'DEPLOYED' || record.status === 'IMAGE_VALIDATED';
    const isInProgress = record.status.includes('PROGRESS') || record.status.includes('TRIGGERED') || record.status.includes('IN_PROGRESS');

    if (isSuccess) {
      return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700"><CheckCircle size={12} /> Success</span>;
    } else if (isFailed) {
      return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700"><XCircle size={12} /> Failed</span>;
    } else if (isInProgress) {
      return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700"><Loader2 size={12} className="animate-spin" /> In Progress</span>;
    }
    return <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">{record.status}</span>;
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-stone-50 p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Deployment Journal 📜</h2>
        <p className="text-slate-500">Track all gardening activities and growth records.</p>
        {USE_MOCK && <p className="text-xs text-amber-600 mt-2">⚠️ Running in MOCK mode (Set VITE_API_URL to enable real backend)</p>}
      </header>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
          Error: {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Service / Version</th>
              <th className="px-6 py-4 font-bold">Strategy</th>
              <th className="px-6 py-4 font-bold">Summary</th>
              <th className="px-6 py-4 font-bold">Time</th>
              <th className="px-6 py-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deployments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  No deployments yet. Start your first deployment! 🌱
                </td>
              </tr>
            ) : (
              deployments.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    {getStatusDisplay(record)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{record.serviceId}</div>
                    <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                      <GitCommit size={12} /> {record.imageTag}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 capitalize">{record.strategy}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                    {record.description || record.error || '-'}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {formatTime(record.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete deployment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}