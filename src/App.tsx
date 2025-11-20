import { useState } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DeploymentConsole from './pages/DeploymentConsole';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import DeployStartPage from './pages/DeployStartPage';

type PageType = 'login' | 'dashboard' | 'deploy' | 'history' | 'settings' | 'launch';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');

  // Login page occupies the full viewport independently
  if (currentPage === 'login') {
    return <LoginPage onLogin={() => setCurrentPage('dashboard')} />;
  }

  return (
    // Lock the layout to the viewport height and hide overflow to avoid body scroll
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-stone-50 font-sans text-slate-900">
      
      {/* Top navigation */}
      <Navbar 
        currentPage={currentPage} 
        onNavigate={(page) => setCurrentPage(page)}
        onLogout={() => setCurrentPage('login')}
      />
      
      {/* Main content takes the remaining space */}
      <main className="flex-1 relative overflow-hidden">
        
        {/* Case A: Scrollable pages */}
        {['dashboard', 'history', 'settings', 'launch'].includes(currentPage) && (
          <div className="h-full w-full overflow-y-auto">
            {currentPage === 'dashboard' && (
              <DashboardPage 
                onManage={() => setCurrentPage('deploy')} 
                onStartDeploy={() => setCurrentPage('launch')}
              />
            )}
            {currentPage === 'history' && <HistoryPage />}
            {currentPage === 'settings' && <SettingsPage />}
            {currentPage === 'launch' && (
              <DeployStartPage 
                onStartDeploy={() => setCurrentPage('deploy')} 
                onBack={() => setCurrentPage('dashboard')}
              />
            )}
          </div>
        )}
        
        {/* Case B: Full-height page with its own internal scrolling */}
        {currentPage === 'deploy' && (
          <div className="h-full w-full overflow-hidden">
            <DeploymentConsole onBack={() => setCurrentPage('dashboard')} />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;