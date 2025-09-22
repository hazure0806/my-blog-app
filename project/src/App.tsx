import { useState } from 'react';
import { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/blog/HomePage';
import { ArticlePage } from './components/blog/ArticlePage';
import { ArticlesListPage } from './components/blog/ArticlesListPage';
import { MarkdownEditor } from './components/editor/MarkdownEditor';
import { Dashboard } from './components/admin/Dashboard';
import { LoginForm } from './components/auth/LoginForm';
import { useAuth } from './hooks/useAuth';

type View = 'home' | 'article' | 'articles-list' | 'dashboard' | 'editor' | 'login';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [lastLogoClickTime, setLastLogoClickTime] = useState(0);
  const { isAuthenticated, isAdmin, loading } = useAuth();
  console.log(isAuthenticated, isAdmin, loading);

  // キーボードショートカットでの管理者モード切り替え
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Shift+A で管理者モード切り替え
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        handleAdminToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  // URL直接アクセスでの管理者モード
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin' || path === '/dashboard') {
      setCurrentView('dashboard');
      // URLを元に戻す（セキュリティのため）
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // ログイン成功時にダッシュボードに遷移
  useEffect(() => {
    if (isAuthenticated && isAdmin && currentView === 'login') {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, isAdmin, currentView]);
  const handleAdminToggle = () => {
    if (isAdmin && isAuthenticated) {
      setCurrentView('home');
    } else {
      // 管理者モードに入る前にログインが必要
      setCurrentView('login');
    }
  };

  const handleLoginCancel = () => {
    setCurrentView('home');
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  // ロゴの連続クリックでの管理者モード切り替え
  const handleLogoClick = () => {
    const now = Date.now();
    
    // 前回のクリックから2秒以内の場合のみカウント
    if (now - lastLogoClickTime < 2000) {
      const newCount = logoClickCount + 1;
      setLogoClickCount(newCount);
      
      // 5回連続クリックで管理者モード
      if (newCount >= 5) {
        handleAdminToggle();
        setLogoClickCount(0);
      }
    } else {
      setLogoClickCount(1);
    }
    
    setLastLogoClickTime(now);
  };
  const handleNavigateToEditor = () => {
    setCurrentView('editor');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // ローディング状態の処理
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">読み込み中...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (currentView === 'login') {
      return (
        <LoginForm 
          onCancel={handleLoginCancel}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }
    
    if (isAdmin && isAuthenticated) {
      switch (currentView) {
        case 'editor':
          return <MarkdownEditor onBackToDashboard={handleBackToDashboard} />;
        case 'dashboard':
          return <Dashboard 
            onNavigateToEditor={handleNavigateToEditor} 
            onNavigateToArticlesList={() => setCurrentView('articles-list')}
            onLogout={() => setCurrentView('home')}
          />;
        default:
          return <Dashboard 
            onNavigateToEditor={handleNavigateToEditor} 
            onNavigateToArticlesList={() => setCurrentView('articles-list')}
            onLogout={() => setCurrentView('home')}
          />;
      }
    }
    
    switch (currentView) {
      case 'articles-list':
        return <ArticlesListPage onBack={() => setCurrentView('home')} />;
      case 'article':
        return <ArticlePage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {!isAdmin && currentView !== 'login' && (
        <Header onLogoClick={handleLogoClick} />
      )}
      
      <div className="relative">
        {renderContent()}
        
        {/* Navigation overlay for demo purposes */}
        {!isAdmin && currentView !== 'login' && (
          <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
              }`}
            >
              ホーム
            </button>
            <button
              onClick={() => setCurrentView('articles-list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'articles-list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
              }`}
            >
              記事一覧
            </button>
            <button
              onClick={() => setCurrentView('article')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'article'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
              }`}
            >
              記事
            </button>
            {/* 管理者モードのヒント（開発時のみ表示） */}
            <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400 max-w-48">
              <div className="font-medium mb-1">管理者モード:</div>
              <div>• Ctrl+Shift+A</div>
              <div>• ロゴを5回クリック</div>
              <div>• /admin にアクセス</div>
            </div>
          </div>
        )}
      </div>
      
      {!isAdmin && currentView !== 'login' && <Footer />}
    </div>
  );
}

export default App;