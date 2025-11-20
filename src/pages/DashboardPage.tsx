import { Leaf, AlertCircle, ArrowRight } from 'lucide-react';

// --- Type definitions & mock data ---
interface Service {
  id: number;
  name: string;
  status: 'healthy' | 'warning';
  version: string;
  pods: number;
  lastDeploy: string;
}

const services: Service[] = [
  { id: 1, name: 'demo-api', status: 'healthy', version: 'v1.0.2', pods: 3, lastDeploy: '2h ago' },
  { id: 2, name: 'demo-frontend', status: 'warning', version: 'v2.1.0', pods: 2, lastDeploy: '1d ago' },
];

interface ServiceCardProps {
  service: Service;
  onManage: () => void;
}

const ServiceCard = ({ service, onManage }: ServiceCardProps) => {
  const isHealthy = service.status === 'healthy';
  // ServiceCard UI
  return (
    <div className={`
      relative overflow-hidden rounded-2xl border-2 p-6 transition-all hover:shadow-lg
      ${isHealthy ? 'border-green-100 bg-white' : 'border-amber-100 bg-amber-50'}
    `}>
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-20 
        ${isHealthy ? 'bg-green-200' : 'bg-amber-200'}`} 
      />
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-3 ${isHealthy ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
            {isHealthy ? <Leaf size={24} /> : <AlertCircle size={24} />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{service.name}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full 
              ${isHealthy ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {service.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
        <div>
          <p className="text-xs text-slate-400">Version</p>
          <p className="font-mono font-semibold">{service.version}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Last Watered</p>
          <p className="font-medium">{service.lastDeploy}</p>
        </div>
      </div>
      <button 
        onClick={onManage}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-700"
      >
        Manage Garden <ArrowRight size={16} />
      </button>
    </div>
  );
};

interface DashboardPageProps {
  onManage: () => void;
  onStartDeploy: () => void;
}

export default function DashboardPage({ onManage, onStartDeploy }: DashboardPageProps) {
  return (
    // Fill available height so the parent container keeps layout tight
    <div className="min-h-full bg-stone-50 p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">My Digital Garden 🌿</h1>
        <p className="text-slate-500">Manage your Kubernetes deployments with peace of mind.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={onStartDeploy}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300 transition hover:bg-slate-700"
          >
            🌱 Start Deployment
          </button>
          <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-white">
            View AWS Architecture
          </button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((svc) => (
          <ServiceCard key={svc.id} service={svc} onManage={onManage} />
        ))}
      </div>
    </div>
  );
}