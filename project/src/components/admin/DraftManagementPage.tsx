import React, { useState } from 'react';
import { 
  FileText, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar,
  ArrowLeft,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useArticles } from '../../hooks/useArticles';
import type { Article } from '../../types/firebase';

interface DraftManagementPageProps {
  onBack: () => void;
  onNavigateToEditor: () => void;
  onNavigateToEditArticle: (articleId: string) => void;
}

export function DraftManagementPage({ 
  onBack, 
  onNavigateToEditor, 
  onNavigateToEditArticle 
}: DraftManagementPageProps) {
  const { articles, loading, error, removeArticle, editArticle } = useArticles();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 下書き記事のみをフィルタリング
  const draftArticles = articles.filter(article => article.status === 'draft');

  // カテゴリの一覧を取得
  const categories = ['すべて', ...Array.from(new Set(draftArticles.map(article => article.category).filter(Boolean)))];

  // フィルタリング処理
  const filteredDrafts = draftArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'すべて' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 下書きを公開する
  const handlePublishDraft = async (articleId: string) => {
    try {
      await editArticle(articleId, { 
        status: 'published' as const,
        publishedAt: new Date()
      });
      alert('記事を公開しました');
    } catch (err) {
      console.error('Error publishing article:', err);
      alert('公開に失敗しました');
    }
  };

  // 下書きを削除する
  const handleDeleteDraft = async (articleId: string) => {
    if (!confirm('この下書きを削除してもよろしいですか？')) {
      return;
    }

    try {
      setDeletingId(articleId);
      await removeArticle(articleId);
      alert('下書きを削除しました');
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('削除に失敗しました');
    } finally {
      setDeletingId(null);
    }
  };

  // 日付のフォーマット
  const formatDate = (date: Date | undefined) => {
    if (!date) return '未設定';
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">下書きを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <FileText className="h-8 w-8 mx-auto mb-2" />
            <p className="text-lg font-medium">エラーが発生しました</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
          </div>
          <Button onClick={onBack}>
            ダッシュボードに戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                ダッシュボードに戻る
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  下書き管理
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  下書き記事の管理と編集
                </p>
              </div>
            </div>
            <Button onClick={onNavigateToEditor} className="gap-2">
              <Plus className="h-4 w-4" />
              新しい記事を作成
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                下書き記事数
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {draftArticles.length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                公開待ちの記事
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                今月の下書き
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {draftArticles.filter(article => {
                  const now = new Date();
                  const articleDate = article.updatedAt;
                  return articleDate.getMonth() === now.getMonth() && 
                         articleDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                今月作成・更新
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                平均読了時間
              </CardTitle>
              <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {draftArticles.length > 0 
                  ? `${Math.round(draftArticles.reduce((sum, article) => sum + article.readTime, 0) / draftArticles.length)}分`
                  : '0分'
                }
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                下書き記事の平均
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 検索・フィルター */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="記事タイトルで検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 下書き記事一覧 */}
        {filteredDrafts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {draftArticles.length === 0 ? '下書き記事がありません' : '該当する下書き記事がありません'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {draftArticles.length === 0 
                    ? '新しい記事を作成して下書きとして保存しましょう'
                    : '検索条件を変更して再度お試しください'
                  }
                </p>
                {draftArticles.length === 0 && (
                  <Button onClick={onNavigateToEditor} className="gap-2">
                    <Plus className="h-4 w-4" />
                    新しい記事を作成
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredDrafts.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-xs font-medium">
                          下書き
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-full text-xs font-medium">
                          {article.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      {article.excerpt && (
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          更新: {formatDate(article.updatedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.readTime}分
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigateToEditArticle(article.id)}
                        className="gap-1"
                      >
                        <Edit3 className="h-4 w-4" />
                        編集
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePublishDraft(article.id)}
                        className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                      >
                        <Eye className="h-4 w-4" />
                        公開
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDraft(article.id)}
                        disabled={deletingId === article.id}
                        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deletingId === article.id ? '削除中...' : '削除'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
