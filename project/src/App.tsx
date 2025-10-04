import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/blog/HomePage';
import { ArticlePage } from './components/blog/ArticlePage';
import { ArticlesListPage } from './components/blog/ArticlesListPage';
import { MarkdownEditor } from './components/editor/MarkdownEditor';
import { AboutPage } from './components/blog/AboutPage';
import { Dashboard } from './components/admin/Dashboard';
import { DraftManagementPage } from './components/admin/DraftManagementPage';
import { LoginForm } from './components/auth/LoginForm';
import { useAuth } from './hooks/useAuth';
import { initializeStorageDirectories } from './lib/storage';

type View = 'home' | 'article' | 'articles-list' | 'about' | 'dashboard' | 'editor' | 'login' | 'draft-management';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [lastLogoClickTime, setLastLogoClickTime] = useState(0);
  const { isAuthenticated, isAdmin, loading } = useAuth();

  const handleAdminToggle = useCallback(() => {
    if (isAdmin && isAuthenticated) {
      setCurrentView('dashboard'); // 管理者画面に遷移
    } else {
      // 管理者モードに入る前にログインが必要
      setCurrentView('login');
    }
  }, [isAdmin, isAuthenticated]);

  // Firebase Storageの初期化
  useEffect(() => {
    const initStorage = async () => {
      try {
        await initializeStorageDirectories();
        console.log('Storage directories initialized successfully');
      } catch (error) {
        console.error('Failed to initialize storage directories:', error);
      }
    };

    initStorage();
  }, []);

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
  }, [handleAdminToggle]);

  // URL直接アクセスでの管理者モードと記事詳細ページ
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin' || path === '/dashboard') {
      setCurrentView('dashboard');
      // URLを元に戻す（セキュリティのため）
      window.history.replaceState({}, '', '/');
    } else if (path.startsWith('/article/')) {
      const articleId = path.split('/article/')[1];
      if (articleId) {
        setCurrentArticleId(articleId);
        setCurrentView('article');
      }
    }
  }, []);

  // ログイン成功時にダッシュボードに遷移
  useEffect(() => {
    if (isAuthenticated && isAdmin && currentView === 'login') {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, isAdmin, currentView]);

  // ページ遷移時にスクロール位置をリセット
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

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
    setEditingArticleId(null); // 新規作成モード
    setCurrentView('editor');
  };

  const handleNavigateToEditArticle = (articleId: string) => {
    setEditingArticleId(articleId); // 編集モード
    setCurrentView('editor');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setEditingArticleId(null);
  };

  const handleNavigateToArticle = (articleId: string) => {
    setCurrentArticleId(articleId);
    setCurrentView('article');
    // URLを更新（SEOフレンドリーなURL構造）
    window.history.pushState({}, '', `/article/${articleId}`);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentArticleId(null);
    // URLを更新
    window.history.pushState({}, '', '/');
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
          return <MarkdownEditor onBackToDashboard={handleBackToDashboard} editingArticleId={editingArticleId || undefined} />;
        case 'draft-management':
          return <DraftManagementPage 
            onBack={handleBackToDashboard}
            onNavigateToEditor={handleNavigateToEditor}
            onNavigateToEditArticle={handleNavigateToEditArticle}
          />;
        case 'dashboard':
          return <Dashboard 
            onNavigateToEditor={handleNavigateToEditor} 
            onNavigateToArticlesList={() => setCurrentView('articles-list')}
            onLogout={() => setCurrentView('home')}
            onNavigateToEditArticle={handleNavigateToEditArticle}
            onNavigateToDraftManagement={() => setCurrentView('draft-management')}
          />;
        default:
          return <Dashboard 
            onNavigateToEditor={handleNavigateToEditor} 
            onNavigateToArticlesList={() => setCurrentView('articles-list')}
            onLogout={() => setCurrentView('home')}
            onNavigateToEditArticle={handleNavigateToEditArticle}
            onNavigateToDraftManagement={() => setCurrentView('draft-management')}
          />;
      }
    }
    
    switch (currentView) {
      case 'articles-list':
        return <ArticlesListPage onBack={handleBackToHome} onNavigateToArticle={handleNavigateToArticle} isAdmin={isAdmin} />;
      case 'article':
        return <ArticlePage articleId={currentArticleId} onBack={handleBackToHome} isAdmin={isAdmin} />;
      case 'about':
        return <AboutPage onBack={handleBackToHome} />;
      case 'home':
      default:
        return <HomePage 
          onNavigateToArticle={handleNavigateToArticle}
          onNavigateToArticlesList={() => setCurrentView('articles-list')}
          onNavigateToAbout={() => setCurrentView('about')}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {!isAdmin && currentView !== 'login' && (
        <Header 
          onLogoClick={handleLogoClick}
          onNavigateToHome={handleBackToHome}
          onNavigateToArticlesList={() => setCurrentView('articles-list')}
          currentView={currentView}
          isAdmin={isAdmin}
        />
      )}
      
      <div className="relative">
        {renderContent()}
      </div>
      
      {!isAdmin && currentView !== 'login' && (
        <Footer 
          onNavigateToHome={handleBackToHome}
          onNavigateToArticlesList={() => setCurrentView('articles-list')}
          onNavigateToAbout={() => setCurrentView('about')}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}

export default App;