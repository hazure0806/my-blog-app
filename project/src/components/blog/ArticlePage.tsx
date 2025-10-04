import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { AuthorBio } from './AuthorBio';
import { ShareButtons } from './ShareButtons';
import { TableOfContents } from './TableOfContents';
import { ArticleCard } from './ArticleCard';
import { Button } from '../ui/button';
import { getArticle, getAuthor, incrementArticleViews } from '../../lib/firestore';
import { updateSEO, generateArticleSEO, generateStructuredData, insertStructuredData } from '../../utils/seo';
import { InArticleAd, SidebarAd } from '../ads/AdSense';
import { shouldDisplayAd, shouldShowInArticleAd } from '../../utils/adConfig';
import type { Article, Author } from '../../types/firebase';


interface ArticlePageProps {
  articleId: string | null;
  onBack: () => void;
  isAdmin?: boolean;
}

export function ArticlePage({ articleId, onBack, isAdmin = false }: ArticlePageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleData = async () => {
      if (!articleId) {
        setError('記事IDが指定されていません');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const [articleData, authorData] = await Promise.all([
          getArticle(articleId),
          getAuthor()
        ]);

        if (!articleData) {
          setError('記事が見つかりません');
          return;
        }

        setArticle(articleData);
        setAuthor(authorData);
        
        // SEOメタタグを更新
        updateSEO(generateArticleSEO(articleData));
        
        // 構造化データを挿入
        const structuredData = generateStructuredData('article', articleData);
        insertStructuredData(structuredData);
        
        // 閲覧数をカウントアップ（エラーが発生しても記事表示は継続）
        try {
          await incrementArticleViews(articleId);
          console.log('Article views updated successfully');
        } catch (viewError) {
          console.warn('Failed to increment views:', viewError);
          // 閲覧数の更新に失敗しても記事表示は継続
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('記事の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [articleId]);

  // ローディング状態
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">記事を読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー状態
  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            記事が見つかりません
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {error || '指定された記事は存在しないか、削除された可能性があります。'}
          </p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            ホームに戻る
          </Button>
        </div>
      </div>
    );
  }
  const renderContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    const totalParagraphs = paragraphs.length;
    
    return paragraphs.map((paragraph, index) => {
        if (paragraph.startsWith('##')) {
          return (
            <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-6 first:mt-0">
              {paragraph.replace('## ', '')}
            </h2>
          );
        }
        
        if (paragraph.startsWith('###')) {
          return (
            <h3 key={index} className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">
              {paragraph.replace('### ', '')}
            </h3>
          );
        }
        
        if (paragraph.startsWith('```')) {
          const codeBlock = paragraph.slice(3, -3);
          const [lang, ...codeLines] = codeBlock.split('\n');
          const code = codeLines.join('\n');
          return (
            <pre key={index} className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto my-8 border border-gray-200 dark:border-gray-700">
              <code className="text-sm font-mono leading-relaxed">{code}</code>
            </pre>
          );
        }
        
        if (paragraph.startsWith('>')) {
          return (
            <blockquote key={index} className="border-l-4 border-orange-500 pl-6 py-4 my-8 bg-orange-50 dark:bg-orange-900/20 rounded-r-lg">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                {paragraph.replace('> ', '')}
              </p>
            </blockquote>
          );
        }
        
        if (paragraph.startsWith('-')) {
          const listItems = paragraph.split('\n').filter(item => item.startsWith('-'));
          return (
            <ul key={index} className="space-y-2 my-6">
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="text-emerald-600 dark:text-emerald-400 mr-3 mt-1">•</span>
                  {item.replace('- ', '')}
                </li>
              ))}
            </ul>
          );
        }
        
        if (paragraph.match(/^\d+\./)) {
          const listItems = paragraph.split('\n').filter(item => item.match(/^\d+\./));
          return (
            <ol key={index} className="space-y-2 my-6">
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="text-orange-600 dark:text-orange-400 mr-3 mt-1 font-medium">
                    {itemIndex + 1}.
                  </span>
                  {item.replace(/^\d+\. /, '')}
                </li>
              ))}
            </ol>
          );
        }
        
        // 画像のMarkdown記法をチェック
        if (paragraph.match(/^!\[.*?\]\(.*?\)$/)) {
          const imageMatch = paragraph.match(/^!\[(.*?)\]\((.*?)\)$/);
          if (imageMatch) {
            const [, altText, imageUrl] = imageMatch;
            return (
              <div key={index} className="my-8">
                <img
                  src={imageUrl}
                  alt={altText || '画像'}
                  className="w-full h-auto rounded-lg shadow-lg max-w-full"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    console.error('Image load error:', imageUrl);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                {altText && altText !== '画像' && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                    {altText}
                  </p>
                )}
              </div>
            );
          }
        }

        const paragraphElement = (
          <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-lg">
            {paragraph.split('`').map((part, partIndex) => 
              partIndex % 2 === 0 ? (
                <span key={partIndex}>{part}</span>
              ) : (
                <code key={partIndex} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-base font-mono text-blue-600 dark:text-blue-400">
                  {part}
                </code>
              )
            )}
          </p>
        );

        // 記事内広告の表示判定
        const showInArticleAd = shouldShowInArticleAd(index, totalParagraphs) && 
                               shouldDisplayAd('article', isAdmin);

        return (
          <React.Fragment key={index}>
            {paragraphElement}
            {showInArticleAd && <InArticleAd />}
          </React.Fragment>
        );
      });
  };

  // 日付のフォーマット
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // 読了時間のフォーマット
  const formatReadTime = (minutes: number | undefined) => {
    if (!minutes) return '';
    return `${minutes}分`;
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={article.imageUrl || 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200'}
          alt={article.title}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="mx-auto max-w-4xl px-4">
            <Button variant="ghost" className="text-white/90 hover:text-white mb-4" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              記事一覧に戻る
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Table of Contents - Hidden on mobile */}
          <div className="hidden lg:block">
            <TableOfContents />
          </div>

          {/* Main Content */}
          <article className="lg:col-span-2">
            {/* Article Header */}
            <header className="mb-12">
              <div className="mb-6">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {article.category || '未分類'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{formatReadTime(article.readTime)}</span>
                </div>
              </div>
              
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
              {renderContent(article.content)}
            </div>

            {/* Author Bio */}
            {author && (
              <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
                <AuthorBio {...author} />
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            <ShareButtons url={window.location.href} title={article.title} />
            
            {/* サイドバー広告 */}
            {shouldDisplayAd('article', isAdmin) && (
              <div className="sticky top-24">
                <SidebarAd />
              </div>
            )}
          </aside>
        </div>

        {/* Related Articles - 現在は関連記事機能は未実装のためコメントアウト */}
        {/* <section className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            関連記事
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedArticles.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </div>
        </section> */}
      </div>
    </main>
  );
}