import React from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Eye, 
  TrendingUp, 
  Calendar,
  Edit3,
  Plus,
  Settings,
  MessageSquare,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

interface DashboardProps {
  onNavigateToEditor: () => void;
  onNavigateToArticlesList?: () => void;
  onLogout?: () => void;
}

export function Dashboard({ onNavigateToEditor, onNavigateToArticlesList, onLogout }: DashboardProps) {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const stats = {
    totalViews: 12543,
    monthlyViews: 3421,
    totalArticles: 28,
    publishedArticles: 25,
    draftArticles: 3,
    totalComments: 156,
    monthlyGrowth: 15.3,
    avgReadTime: '5分30秒'
  };

  const recentArticles = [
    {
      title: '毎日のコーヒータイムを特別にする5つの方法',
      views: 1456,
      comments: 23,
      publishedAt: '2025年1月20日',
      status: 'published'
    },
    {
      title: '栄養バランスを考えた一週間の食事プラン',
      views: 1123,
      comments: 15,
      publishedAt: '2025年1月18日',
      status: 'published'
    },
    {
      title: '週末の小さな冒険：近所のカフェ巡り記録',
      views: 0,
      comments: 0,
      publishedAt: '',
      status: 'draft'
    }
  ];

  const topArticles = [
    { title: '毎日のコーヒータイムを特別にする5つの方法', views: 1456 },
    { title: '栄養バランスを考えた一週間の食事プラン', views: 1123 },
    { title: 'React 19の新機能：Server Componentsとその活用方法', views: 892 },
    { title: '在宅ワークの生産性を上げる環境づくり', views: 743 },
    { title: 'TypeScriptの型システムを活用した保守性の高いコード設計', views: 621 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                管理者ダッシュボード
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                ブログの統計情報と管理機能
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={onNavigateToEditor} className="gap-2">
                <Plus className="h-4 w-4" />
                新しい記事を作成
              </Button>
              <Button
                onClick={toggleTheme}
                variant="outline"
                className="gap-2"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDark ? 'ライト' : 'ダーク'}
              </Button>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                設定
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={async () => {
                  await logout();
                  if (onLogout) onLogout();
                }}
              >
                <LogOut className="h-4 w-4" />
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                総ページビュー
              </CardTitle>
              <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                今月: {stats.monthlyViews.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                記事数
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.totalArticles}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                公開済み: {stats.publishedArticles} / 下書き: {stats.draftArticles}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                コメント数
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.totalComments}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                今月の成長率: +{stats.monthlyGrowth}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                平均読了時間
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.avgReadTime}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                +12% 先月比
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                最近の記事
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentArticles.map((article, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
                        {article.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {article.comments}
                        </span>
                        {article.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {article.publishedAt}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        article.status === 'published' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {article.status === 'published' ? '公開済み' : '下書き'}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onNavigateToArticlesList}
                >
                  すべての記事を表示
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Top Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                人気記事ランキング
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topArticles.map((article, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : index === 1
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-800/20 dark:text-blue-400'
                        : index === 2
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-800/10 dark:text-blue-500'
                        : 'bg-gray-50 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2">
                        {article.title}
                      </h4>
                    </div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {article.views.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={onNavigateToEditor} className="h-20 flex-col gap-2">
                <Plus className="h-6 w-6" />
                新しい記事を作成
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="h-6 w-6" />
                下書きを管理
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                詳細な分析を表示
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}