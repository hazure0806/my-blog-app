import { useEffect } from 'react';
import { ArticleCard } from './ArticleCard';
import { AuthorBio } from './AuthorBio';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { useArticles } from '../../hooks/useArticles';
import { AUTHOR_INFO } from '../../constants/author';
import { updateSEO, generateHomeSEO, generateStructuredData, insertStructuredData } from '../../utils/seo';


interface HomePageProps {
  onNavigateToArticle: (articleId: string) => void;
  onNavigateToArticlesList: () => void;
  onNavigateToAbout?: () => void;
}

export function HomePage({ onNavigateToArticle, onNavigateToArticlesList, onNavigateToAbout }: HomePageProps) {
  const { articles, loading, error } = useArticles();

  // SEOメタタグを更新
  useEffect(() => {
    updateSEO(generateHomeSEO());
    
    // 構造化データを挿入
    const structuredData = generateStructuredData('website');
    insertStructuredData(structuredData);
  }, []);

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

  // 公開済み記事のみをフィルタリング
  const publishedArticles = articles.filter(article => article.status === 'published');
  const featuredArticle = publishedArticles.find(article => article.featured) || publishedArticles[0];
  
  // フィーチャー記事以外の記事を取得（最大6件）
  const otherArticles = publishedArticles
    .filter(article => article.id !== featuredArticle?.id)
    .slice(0, 6);
  
  // 記事一覧ページに表示する記事が7件を超えているかチェック
  const hasMoreArticles = publishedArticles.length > 7;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero Section with Featured Article */}
        {featuredArticle && (
          <section className="mb-16">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                最新の記事
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                日々の発見や学び、興味のあることを自由に綴っています
              </p>
            </div>
            <div onClick={() => onNavigateToArticle(featuredArticle.id)}>
              <ArticleCard {...featuredArticle} />
            </div>
          </section>
        )}

        {/* Recent Articles Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              記事一覧
            </h2>
            {hasMoreArticles && (
              <Button 
                variant="outline" 
                onClick={onNavigateToArticlesList}
                className="gap-2"
              >
                もっと記事を見る
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          {otherArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherArticles.map((article) => (
                <div key={article.id} onClick={() => onNavigateToArticle(article.id)}>
                  <ArticleCard {...article} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">まだ記事がありません</p>
            </div>
          )}
        </section>

        {/* Author Bio Section */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            著者について
          </h2>
          <AuthorBio {...AUTHOR_INFO} onNavigateToAbout={onNavigateToAbout} />
        </section>
      </div>
    </main>
  );
}