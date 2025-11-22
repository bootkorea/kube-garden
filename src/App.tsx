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

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig | null>(null);

  // Login page occupies the full viewport independently
  if (currentPage === 'login') {
    return <LoginPage onLogin={() => setCurrentPage('dashboard')} />;
  }

  const handleStartDeployment = (config: DeploymentConfig) => {
    setDeploymentConfig(config);
    setCurrentPage('deploy');
  };

  const handleBackFromDeploy = () => {
    setDeploymentConfig(null);
    setCurrentPage('dashboard');
  };

  const handleManageService = (service: any) => {
    const config: DeploymentConfig = {
      serviceName: service.name,
      githubRepo: service.githubRepo || '',
      strategy: 'canary', // Default strategy for redeploy
      description: 'Redeploy from dashboard',
      environment: 'production',
    };
    setDeploymentConfig(config);
    setCurrentPage('deploy');
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
                onManage={handleManageService}
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
            />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;