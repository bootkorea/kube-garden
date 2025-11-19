import { Leaf, AlertCircle, ArrowRight } from 'lucide-react';

// --- (이전과 동일한 타입 정의 및 Mock Data) ---
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
  // --- (ServiceCard 내부 코드는 이전과 동일하므로 생략 가능하나, 복붙 편의를 위해 유지) ---
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
}

export default function DashboardPage({ onManage }: DashboardPageProps) {
  return (
    // [수정 포인트] min-h-screen을 제거하고 min-h-full로 변경하여 부모 높이에 맞춤
    <div className="min-h-full bg-stone-50 p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">My Digital Garden 🌿</h1>
        <p className="text-slate-500">Manage your Kubernetes deployments with peace of mind.</p>
      </header>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((svc) => (
          <ServiceCard key={svc.id} service={svc} onManage={onManage} />
        ))}
      </div>
    </div>
  );
}