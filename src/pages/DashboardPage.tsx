import { useState, useEffect } from 'react';
import { Leaf, AlertCircle, ArrowRight, Sprout, Trash2, Filter, ArrowUpDown } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

// --- Type definitions & mock data ---
interface Service {
  id: string;
  name: string;
  status: 'healthy' | 'warning';
  version: string;
  pods: number;
  lastDeploy: string;
  position: { x: number; y: number }; // Position on garden (percentage)
  githubRepo?: string;
  githubOwner?: string;
}



interface ServiceCardProps {
  service: Service;
  onManage: () => void;
  onDelete: (id: string) => void;
  copy: {
    version: string;
    lastWatered: string;
    manage: string;
    deleteTitle: string;
    healthy: string;
    warning: string;
  };
}

const ServiceCard = ({ service, onManage, onDelete, copy }: ServiceCardProps) => {
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
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-3 ${isHealthy ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
              {isHealthy ? <Leaf size={24} /> : <AlertCircle size={24} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{service.name}</h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full 
                ${isHealthy ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {isHealthy ? copy.healthy : copy.warning}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(service.id);
            }}
            className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            title={copy.deleteTitle}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
        <div>
          <p className="text-xs text-slate-400">{copy.version}</p>
          <p className="font-mono font-semibold">{service.version}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">{copy.lastWatered}</p>
          <p className="font-medium">{service.lastDeploy}</p>
        </div>
      </div>
      <button
        onClick={onManage}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition-all hover:bg-green-600 hover:shadow-lg hover:shadow-green-200"
      >
        {copy.manage} <ArrowRight size={16} />
      </button>
    </div>
  );
};

interface DashboardPageProps {
  onManage: () => void;
  onStartDeploy: () => void;
}

export default function DashboardPage({ onManage, onStartDeploy }: DashboardPageProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const [filterStatus, setFilterStatus] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'lastDeploy'>('lastDeploy');
  const { language } = useLanguage();
  const copy = {
    en: {
      title: 'My Garden 🌿',
      subtitle: 'Manage your Kubernetes deployments with peace of mind.',
      mock: '⚠️ Running in MOCK mode',
      startButton: '🌱 Start Deployment',
      gardenAlt: 'Digital Garden',
      confirmDelete: 'Are you sure you want to delete this service?',
      deleteErrorPrefix: 'Error deleting service:',
      healthCheck: '🥕 Garden Health Check',
      healthLabels: {
        healthy: 'Healthy',
        warning: 'Warning',
        critical: 'Critical',
      },
      noServices: 'No services found with this status.',
      filter: {
        all: 'All',
        healthy: 'Healthy',
        warning: 'Warning',
        critical: 'Critical',
        sortBy: 'Sort by',
        name: 'Name',
        lastDeploy: 'Last Deploy',
      },
      serviceCard: {
        version: 'Version',
        lastWatered: 'Last Watered',
        manage: 'Manage Garden',
        deleteTitle: 'Delete service',
        healthy: 'HEALTHY',
        warning: 'WARNING',
      },
    },
    ja: {
      title: '私のデジタルガーデン 🌿',
      subtitle: 'Kubernetes デプロイを安心して管理しましょう。',
      mock: '⚠️ モックモードで動作中',
      startButton: '🌱 デプロイを開始',
      gardenAlt: 'デジタルガーデン',
      confirmDelete: 'このサービスを削除しますか？',
      deleteErrorPrefix: 'サービス削除エラー:',
      healthCheck: 'ガーデンヘルスチェック',
      healthLabels: {
        healthy: '正常',
        warning: '注意',
        critical: '重大',
      },
      noServices: 'このステータスのサービスが見つかりません。',
      filter: {
        all: 'すべて',
        healthy: '正常',
        warning: '注意',
        critical: '重大',
        sortBy: '並び替え',
        name: '名前',
        lastDeploy: '最終デプロイ',
      },
      serviceCard: {
        version: 'バージョン',
        lastWatered: '最終散水',
        manage: '庭を管理',
        deleteTitle: 'サービスを削除',
        healthy: '正常',
        warning: '注意',
      },
    },
    ko: {
      title: '내 디지털 가든 🌿',
      subtitle: 'Kubernetes 배포를 안심하고 관리하세요.',
      mock: '⚠️ MOCK 모드로 실행 중',
      startButton: '🌱 배포 시작',
      gardenAlt: '디지털 가든',
      confirmDelete: '이 서비스를 삭제하시겠습니까?',
      deleteErrorPrefix: '서비스 삭제 오류:',
      healthCheck: '가든 상태 확인',
      healthLabels: {
        healthy: '정상',
        warning: '경고',
        critical: '심각',
      },
      noServices: '이 상태의 서비스를 찾을 수 없습니다.',
      filter: {
        all: '전체',
        healthy: '정상',
        warning: '경고',
        critical: '심각',
        sortBy: '정렬',
        name: '이름',
        lastDeploy: '마지막 배포',
      },
      serviceCard: {
        version: '버전',
        lastWatered: '마지막 배포',
        manage: '가든 관리',
        deleteTitle: '서비스 삭제',
        healthy: '정상',
        warning: '경고',
      },
    },
  } as const;
  const t = copy[language];

  const API_URL = import.meta.env.VITE_API_URL;
  const USE_MOCK = !API_URL || API_URL === 'mock';

  // Helper function to generate consistent random position based on service ID
  // Same ID will always get the same position
  const getPositionFromId = (id: string): { x: number; y: number } => {
    // Simple hash function to convert string ID to number
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    // Use hash to generate consistent pseudo-random values
    const seed1 = Math.abs(hash);
    const seed2 = Math.abs(hash * 31); // Different seed for y
    return {
      x: (seed1 % 8000) / 100 + 10, // 10-90%
      y: (seed2 % 8000) / 100 + 10, // 10-90%
    };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (USE_MOCK) {
      // Mock data fallback
      const mockServices = [
        { id: '1', name: 'demo-api', status: 'healthy' as const, version: 'v1.0.2', pods: 3, lastDeploy: '2h ago', position: getPositionFromId('1') },
        { id: '2', name: 'demo-frontend', status: 'warning' as const, version: 'v2.1.0', pods: 2, lastDeploy: '1d ago', position: getPositionFromId('2') },
      ];
      setServices(mockServices);
      return;
    }

    try {
      // Fetch services
      const servicesRes = await fetch(`${API_URL}/services`);
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        const list = Array.isArray(servicesData) ? servicesData : (servicesData.services || []);
        const mappedServices = list.map((svc: any, idx: number) => {
          const serviceId = svc.id || String(idx);
          return {
            id: serviceId,
            name: svc.name || svc.serviceName || 'unknown',
            status: 'healthy' as const,
            version: 'latest',
            pods: 3,
            lastDeploy: 'N/A',
            position: getPositionFromId(serviceId),
            githubRepo: svc.githubRepo,
            githubOwner: svc.githubOwner,
          };
        });
        setServices(mappedServices);
      }

      // Fetch recent deployments - Endpoint removed in v4
      // const deploymentsRes = await fetch(`${API_URL}/deployments`);
      // if (deploymentsRes.ok) {
      //   const deploymentsData = await deploymentsRes.json();
      //   setRecentDeployments(deploymentsData.slice(0, 5));
      // }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm(t.confirmDelete)) return;

    if (USE_MOCK) {
      setServices(services.filter(s => s.id !== serviceId));
      return;
    }

    try {
      const response = await fetch(`${API_URL}/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete service');

      // Remove from local state
      setServices(services.filter(s => s.id !== serviceId));
    } catch (err: any) {
      alert(`${t.deleteErrorPrefix} ${err.message}`);
    }
  };

  // Calculate health check counts
  const healthyCount = services.filter(s => s.status === 'healthy').length;
  const warningCount = services.filter(s => s.status === 'warning').length;
  
  // Filter services for Health Check panel
  const panelServices = selectedStatus === 'healthy' 
    ? services.filter(s => s.status === 'healthy')
    : selectedStatus === 'warning'
    ? services.filter(s => s.status === 'warning')
    : []; // critical services (empty for now)
  
  // Filter and sort services for Service Cards
  const filteredAndSortedServices = [...services]
    .filter(s => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'critical') return false; // No critical services yet
      return s.status === filterStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        // For lastDeploy, we'd need to parse the date string
        // For now, just sort by name as fallback
        return a.name.localeCompare(b.name);
      }
    });

  return (
    // Fill available height so the parent container keeps layout tight
    <div className="min-h-full bg-stone-50 p-8">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-logo">{t.title}</h1>
          <p className="text-slate-500">{t.subtitle}</p>
          {USE_MOCK && <p className="text-xs text-amber-600 mt-2">{t.mock}</p>}
        </div>
        <button
          onClick={onStartDeploy}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300 transition-all hover:bg-green-600 hover:shadow-green-200"
        >
          {t.startButton}
        </button>
      </header>

      {/* Garden Visualization with Health Check */}
      <div className="mb-10 flex flex-col lg:flex-row gap-6">
        {/* Garden Visualization */}
        <div className="flex-1 relative rounded-3xl shadow-xl overflow-visible" style={{ aspectRatio: '16/8' }}>
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <img
              src="/garden.png"
              alt={t.gardenAlt}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Sprouts positioned on the garden */}
          {services.map((service) => {
            const isHealthy = service.status === 'healthy';
            const showTooltipBelow = service.position.y < 30; // Show tooltip below if service is in top 30%
            return (
              <div
                key={service.id}
                className="absolute group cursor-pointer transition-all hover:scale-125 z-10"
                style={{
                  left: `${service.position.x}%`,
                  top: `${service.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => onManage()}
              >
                <div className="relative">
                  <div className={`rounded-full p-3 shadow-lg transition-all ${isHealthy
                    ? 'bg-green-100 text-green-600 border-2 border-green-300'
                    : 'bg-amber-100 text-amber-600 border-2 border-amber-300'
                    }`}>
                    <Sprout size={32} strokeWidth={2} />
                  </div>
                  {/* Tooltip on hover */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 ${
                    showTooltipBelow ? 'top-full mt-2' : 'bottom-full mb-2'
                  }`}>
                    <div className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                      {service.name}
                      <div className={`text-[10px] mt-1 ${isHealthy ? 'text-green-300' : 'text-amber-300'
                        }`}>
                        {isHealthy ? t.serviceCard.healthy : t.serviceCard.warning}
                      </div>
                      <div className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 ${
                        showTooltipBelow 
                          ? 'top-0 -translate-y-full border-l-4 border-r-4 border-b-4 border-transparent border-b-slate-900'
                          : 'bottom-0 translate-y-full border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900'
                      }`}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Garden Health Check Panel */}
        <div className="lg:w-80 flex-shrink-0 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-lg flex flex-col" style={{ aspectRatio: '16/8', maxHeight: '100%' }}>
          <h2 className="text-xl font-bold text-slate-800 mb-6 font-logo">{t.healthCheck}</h2>
          <div className="flex items-center justify-center gap-4 mb-6 flex-shrink-0">
            {/* Healthy */}
            <button
              onClick={() => setSelectedStatus('healthy')}
              className="flex flex-col items-center cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <div className={`w-16 h-16 rounded-full bg-green-100 flex items-center justify-center shadow-md transition-all ${
                selectedStatus === 'healthy' ? 'ring-4 ring-green-300 ring-offset-2' : ''
              }`}>
                <span className="text-2xl font-bold text-green-700">{healthyCount}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">{t.healthLabels.healthy}</p>
            </button>
            {/* Warning */}
            <button
              onClick={() => setSelectedStatus('warning')}
              className="flex flex-col items-center cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <div className={`w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center shadow-md transition-all ${
                selectedStatus === 'warning' ? 'ring-4 ring-amber-300 ring-offset-2' : ''
              }`}>
                <span className="text-2xl font-bold text-amber-700">{warningCount}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">{t.healthLabels.warning}</p>
            </button>
            {/* Critical - placeholder for future use */}
            <button
              onClick={() => setSelectedStatus('critical')}
              className="flex flex-col items-center cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <div className={`w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shadow-md transition-all ${
                selectedStatus === 'critical' ? 'ring-4 ring-red-300 ring-offset-2' : ''
              }`}>
                <span className="text-2xl font-bold text-red-700">0</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">{t.healthLabels.critical}</p>
            </button>
          </div>
          
          {/* Service List in Panel */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {panelServices.length > 0 ? (
              <div className="space-y-2">
                {panelServices.map((service) => {
                  const isHealthy = service.status === 'healthy';
                  return (
                    <div
                      key={service.id}
                      className={`p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                        isHealthy ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
                      }`}
                      onClick={() => onManage()}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`rounded-full p-1.5 ${isHealthy ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                          {isHealthy ? <Leaf size={14} /> : <AlertCircle size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{service.name}</p>
                          <p className="text-xs text-slate-500">{service.version}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">{t.noServices}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-500" />
          <span className="text-sm font-medium text-slate-700">{t.filter.all}:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.filter.all}
            </button>
            <button
              onClick={() => setFilterStatus('healthy')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filterStatus === 'healthy'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              {t.filter.healthy}
            </button>
            <button
              onClick={() => setFilterStatus('warning')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filterStatus === 'warning'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              {t.filter.warning}
            </button>
            <button
              onClick={() => setFilterStatus('critical')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filterStatus === 'critical'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              {t.filter.critical}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown size={18} className="text-slate-500" />
          <span className="text-sm font-medium text-slate-700">{t.filter.sortBy}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'lastDeploy')}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="name">{t.filter.name}</option>
            <option value="lastDeploy">{t.filter.lastDeploy}</option>
          </select>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedServices.length > 0 ? (
          filteredAndSortedServices.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              onManage={onManage}
              onDelete={handleDeleteService}
              copy={t.serviceCard}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            <p className="text-lg">{t.noServices}</p>
          </div>
        )}
      </div>
    </div>
  );
}