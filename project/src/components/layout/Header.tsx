import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';
import { HeaderAd } from '../ads/AdSense';
import { shouldDisplayAd } from '../../utils/adConfig';

interface HeaderProps {
  onLogoClick?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToArticlesList?: () => void;
  currentView?: string;
  isAdmin?: boolean;
}

export function Header({ onLogoClick, onNavigateToHome, onNavigateToArticlesList, currentView, isAdmin = false }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  
  // 広告表示の判定
  const showHeaderAd = shouldDisplayAd('home', isAdmin) && (currentView === 'home' || currentView === 'articles-list');

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 
                className="text-2xl font-bold text-gray-900 dark:text-gray-100 cursor-pointer select-none"
                onClick={onLogoClick}
              >
                Gaku-Log
              </h1>
              <nav className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={onNavigateToHome}
                  className={`text-sm font-medium transition-colors ${
                    currentView === 'home'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}
                >
                  ホーム
                </button>
                <button 
                  onClick={onNavigateToArticlesList}
                  className={`text-sm font-medium transition-colors ${
                    currentView === 'articles-list'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}
                >
                  記事一覧
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                title="テーマを切り替え"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* ヘッダー広告 */}
      {showHeaderAd && (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="mx-auto max-w-6xl px-4">
            <HeaderAd />
          </div>
        </div>
      )}
    </>
  );
}