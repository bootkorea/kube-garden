import { useState } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DeploymentConsole from './pages/DeploymentConsole';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

type PageType = 'login' | 'dashboard' | 'deploy' | 'history' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');

  // 로그인 페이지는 독립적인 100% 화면
  if (currentPage === 'login') {
    return <LoginPage onLogin={() => setCurrentPage('dashboard')} />;
  }

  return (
    // [수정 1] 화면 전체 높이를 100vh로 고정하고 넘치는 것은 숨김 (브라우저 스크롤 제거)
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-stone-50 font-sans text-slate-900">
      
      {/* 상단 네비게이션 (높이 고정) */}
      <Navbar 
        currentPage={currentPage} 
        onNavigate={(page) => setCurrentPage(page)}
        onLogout={() => setCurrentPage('login')}
      />
      
      {/* [수정 2] 남은 영역(flex-1)을 메인 컨텐츠가 모두 차지하도록 설정 */}
      <main className="flex-1 relative overflow-hidden">
        
        {/* Case A: 스크롤이 필요한 페이지들 (대시보드, 이력, 설정) */}
        {['dashboard', 'history', 'settings'].includes(currentPage) && (
          <div className="h-full w-full overflow-y-auto">
            {currentPage === 'dashboard' && (
              <DashboardPage onManage={() => setCurrentPage('deploy')} />
            )}
            {currentPage === 'history' && <HistoryPage />}
            {currentPage === 'settings' && <SettingsPage />}
          </div>
        )}
        
        {/* Case B: 스크롤이 없어야 하는 페이지 (배포 콘솔 - 내부 스크롤 사용) */}
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