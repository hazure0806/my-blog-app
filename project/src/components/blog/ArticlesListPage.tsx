import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Calendar, Clock, Tag, ArrowLeft, Loader2 } from 'lucide-react';
import { ArticleCard } from './ArticleCard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useArticles } from '../../hooks/useArticles';
import { updateSEO, generateArticlesListSEO, generateStructuredData, insertStructuredData } from '../../utils/seo';
import { ArticleListAd } from '../ads/AdSense';
import { shouldDisplayAd } from '../../utils/adConfig';

interface ArticlesListPageProps {
  onBack: () => void;
  onNavigateToArticle: (articleId: string) => void;
  isAdmin?: boolean;
}


export function ArticlesListPage({ onBack, onNavigateToArticle, isAdmin = false }: ArticlesListPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [sortBy, setSortBy] = useState('newest');
  const [displayCount, setDisplayCount] = useState(12); // 初期表示件数
  const [loadingMore, setLoadingMore] = useState(false);
  const { articles, loading, error } = useArticles();

  // SEOメタタグを更新
  useEffect(() => {
    updateSEO(generateArticlesListSEO());
    
    // 構造化データを挿入
    const structuredData = generateStructuredData('blog');
    insertStructuredData(structuredData);
  }, []);

  // 公開済み記事のみをフィルタリング
  const publishedArticles = articles.filter(article => article.status === 'published');

  // カテゴリの一覧を取得
  const categories = ['すべて', ...Array.from(new Set(publishedArticles.map(article => article.category).filter(Boolean)))];

  // フィルタリングとソート処理をメモ化
  const filteredArticles = useMemo(() => {
    return publishedArticles
      .filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'すべて' || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0);
        } else if (sortBy === 'oldest') {
          return (a.publishedAt?.getTime() || 0) - (b.publishedAt?.getTime() || 0);
        } else if (sortBy === 'readTime') {
          return (a.readTime || 0) - (b.readTime || 0);
        }
        return 0;
      });
  }, [publishedArticles, searchTerm, selectedCategory, sortBy]);

  // 表示する記事（ページネーション適用）
  const displayedArticles = filteredArticles.slice(0, displayCount);
  const hasMoreArticles = filteredArticles.length > displayCount;

  // 検索・フィルタ変更時に表示件数をリセット
  useEffect(() => {
    setDisplayCount(12);
  }, [searchTerm, selectedCategory, sortBy]);

  // さらに記事を読み込む関数
  const handleLoadMore = async () => {
    setLoadingMore(true);
    // 実際のアプリではここでAPIから追加データを取得
    // 今回は既存データから追加表示するため、少し遅延を追加してUXを向上
    await new Promise(resolve => setTimeout(resolve, 500));
    setDisplayCount(prev => prev + 12);
    setLoadingMore(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">記事を読み込み中...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={onBack} 
            variant="ghost" 
            className="mb-4 gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            ホームに戻る
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            すべての記事
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {filteredArticles.length}件の記事が見つかりました
            {displayedArticles.length < filteredArticles.length && (
              <span className="ml-2 text-sm">
                （{displayedArticles.length}件を表示中）
              </span>
            )}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="記事を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
              <option value="readTime">読了時間順</option>
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        {displayedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArticles.map((article, index) => (
              <React.Fragment key={article.id}>
                <div onClick={() => onNavigateToArticle(article.id)}>
                  <ArticleCard {...article} />
                </div>
                
                {/* 記事一覧広告（6記事ごとに表示） */}
                {shouldDisplayAd('articleList', isAdmin) && 
                 (index + 1) % 6 === 0 && 
                 index < displayedArticles.length - 1 && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <ArticleListAd />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              記事が見つかりませんでした
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              検索条件を変更してもう一度お試しください
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('すべて');
              }}
              variant="outline"
            >
              検索条件をリセット
            </Button>
          </div>
        )}

        {/* Load More Button */}
        {hasMoreArticles && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="px-8 gap-2"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  読み込み中...
                </>
              ) : (
                <>
                  さらに記事を読み込む
                  <span className="ml-1 text-sm opacity-75">
                    （あと{filteredArticles.length - displayCount}件）
                  </span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}