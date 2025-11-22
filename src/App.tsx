import { useState } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DeploymentConsole from './pages/DeploymentConsole';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import NewDeploymentPage from './pages/NewDeploymentPage';

type PageType = 'login' | 'dashboard' | 'deploy' | 'history' | 'settings' | 'new-deployment' | 'launch';

interface DeploymentConfig {
  serviceName: string;
  githubRepo: string;
  strategy: string;
  description: string;
  environment?: string; // Optional, can be set to default
}

interface ServiceInfo {
  serviceName: string;
  githubRepo?: string;
  strategy?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig | null>(null);
  const [isRedeploy, setIsRedeploy] = useState(false);

  // Login page occupies the full viewport independently
  if (currentPage === 'login') {
    return <LoginPage onLogin={() => setCurrentPage('dashboard')} />;
  }

  const handleStartDeployment = (config: DeploymentConfig) => {
    setDeploymentConfig(config);
    setCurrentPage('deploy');
  };

  const handleRedeploy = async (serviceInfo: ServiceInfo) => {
    // Fetch full service information from API if needed
    const API_URL = import.meta.env.VITE_API_URL;
    const USE_MOCK = !API_URL || API_URL === 'mock';
    
    let githubRepo = serviceInfo.githubRepo || '';
    let strategy = serviceInfo.strategy || 'canary';
    
    // If we don't have githubRepo, try to fetch from API
    if (!githubRepo && !USE_MOCK) {
      try {
        const response = await fetch(`${API_URL}/services`);
        if (response.ok) {
          const data = await response.json();
          const servicesList = Array.isArray(data) ? data : (data.services || []);
          const service = servicesList.find((s: any) => s.name === serviceInfo.serviceName);
          if (service) {
            githubRepo = service.gitUrl || service.githubRepo || '';
            // Strategy can be inferred from criticality if needed
            if (service.criticality === 'low') strategy = 'rolling';
            else if (service.criticality === 'high') strategy = 'blue-green';
            else strategy = 'canary';
          }
        }
      } catch (error) {
        console.error('Failed to fetch service info:', error);
      }
    }
    
    // Create deployment config for redeploy
    const config: DeploymentConfig = {
      serviceName: serviceInfo.serviceName,
      githubRepo: githubRepo || `https://github.com/user/${serviceInfo.serviceName}`, // Fallback
      strategy: strategy,
      description: 'Redeployment', // Default description for redeploy
    };
    
    setDeploymentConfig(config);
    setIsRedeploy(true);
    setCurrentPage('deploy');
  };

  const handleBackFromDeploy = () => {
    setDeploymentConfig(null);
    setIsRedeploy(false);
    setCurrentPage('dashboard');
  };

  return (
    // Lock the layout to the viewport height and hide overflow to avoid body scroll
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-stone-50 font-sans text-slate-900">

      {/* Top navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page as PageType)}
        onLogout={() => setCurrentPage('login')}
      />

      {/* Main content takes the remaining space */}
      <main className="flex-1 relative overflow-hidden">

        {/* Case A: Scrollable pages */}
        {['dashboard', 'history', 'settings', 'new-deployment', 'launch'].includes(currentPage) && (
          <div className="h-full w-full overflow-y-auto">
            {currentPage === 'dashboard' && (
              <DashboardPage
                onManage={handleRedeploy}
                onStartDeploy={() => setCurrentPage('launch')}
              />
            )}
            {currentPage === 'history' && <HistoryPage />}
            {currentPage === 'settings' && <SettingsPage />}
            {(currentPage === 'new-deployment' || currentPage === 'launch') && (
              <NewDeploymentPage
                onStartDeploy={handleStartDeployment}
                onBack={() => setCurrentPage('dashboard')}
              />
            )}
          </div>
        )}

        {/* Case B: Full-height page with its own internal scrolling */}
        {currentPage === 'deploy' && (
          <div className="h-full w-full overflow-hidden">
            <DeploymentConsole
              onBack={handleBackFromDeploy}
              deploymentConfig={deploymentConfig}
              isRedeploy={isRedeploy}
            />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;