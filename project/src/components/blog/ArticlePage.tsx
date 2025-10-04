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
  // 見出しテキストからIDを生成（日本語対応）
  const generateId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\s-]/g, '') // 日本語文字を保持
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') // 連続するハイフンを単一に
      .replace(/^-|-$/g, '') // 先頭・末尾のハイフンを削除
      .trim();
  };

  const renderContent = (content: string) => {
    // より簡潔で確実なマークダウン変換
    const lines = content.split('\n');
    const totalLines = lines.length;
    
    return lines.map((line, index) => {
      // 見出し1
      if (line.startsWith('# ')) {
        const text = line.replace('# ', '');
        const id = generateId(text);
        return (
          <h1 key={index} id={id} className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-4 first:mt-0 leading-tight">
            {text}
          </h1>
        );
      }
      
      // 見出し2
      if (line.startsWith('## ')) {
        const text = line.replace('## ', '');
        const id = generateId(text);
        return (
          <h2 key={index} id={id} className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-5 mb-3 leading-tight">
            {text}
          </h2>
        );
      }
      
      // 見出し3
      if (line.startsWith('### ')) {
        const text = line.replace('### ', '');
        const id = generateId(text);
        return (
          <h3 key={index} id={id} className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2 leading-tight">
            {text}
          </h3>
        );
      }
      
      // コードブロック
      if (line.startsWith('```')) {
        const codeBlock = [];
        let i = index + 1;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeBlock.push(lines[i]);
          i++;
        }
        
        return (
          <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-3 border border-gray-200 dark:border-gray-700">
            <code className="text-sm font-mono leading-tight">{codeBlock.join('\n')}</code>
          </pre>
        );
      }
      
      // 引用
      if (line.startsWith('> ')) {
        return (
          <blockquote key={index} className="border-l-4 border-blue-500 pl-4 py-2 my-3 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
            <p className="text-gray-700 dark:text-gray-300 leading-tight font-medium">
              {line.replace('> ', '')}
            </p>
          </blockquote>
        );
      }
      
      // リスト項目
      if (line.startsWith('- ')) {
        const listText = line.replace('- ', '');
        const processedListText = listText
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
          .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-600 dark:text-blue-400">$1</code>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
        
        return (
          <div key={index} className="flex items-center text-gray-700 dark:text-gray-300 leading-tight my-1 text-lg">
            <span className="text-blue-600 dark:text-blue-400 mr-3 text-lg">•</span>
            <span className="flex-1" dangerouslySetInnerHTML={{ __html: processedListText }} />
          </div>
        );
      }
      
      // 番号付きリスト
      if (line.match(/^\d+\. /)) {
        const match = line.match(/^(\d+)\. (.*)/);
        if (match) {
          const [, num, text] = match;
          const processedListText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-600 dark:text-blue-400">$1</code>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
          
          return (
            <div key={index} className="flex items-center text-gray-700 dark:text-gray-300 leading-tight my-1 text-lg">
              <span className="text-blue-600 dark:text-blue-400 mr-2 font-medium min-w-[1.5rem]">
                {num}.
              </span>
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: processedListText }} />
            </div>
          );
        }
      }
      
      // 画像
      if (line.match(/^!\[.*?\]\(.*?\)$/)) {
        const match = line.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (match) {
          const [, altText, imageUrl] = match;
          return (
            <div key={index} className="my-4">
              <img
                src={imageUrl}
                alt={altText || '画像'}
                className="w-full h-auto rounded-lg shadow-lg"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  console.error('Image load error:', imageUrl);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              {altText && altText !== '画像' && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1 italic">
                  {altText}
                </p>
              )}
            </div>
          );
        }
      }
      
      // 空行
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // 通常の段落
      const processedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-600 dark:text-blue-400">$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
      
      return (
        <p 
          key={index} 
          className="text-gray-700 dark:text-gray-300 leading-tight mb-2 text-lg"
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
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
          {/* Main Content */}
          <div className="lg:col-span-3">
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
                <div className="flex flex-wrap gap-2 mb-6">
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
              
              {/* シェアボタンを記事ヘッダーに配置 */}
              <div className="mb-8">
                <ShareButtons url={window.location.href} title={article.title} />
              </div>
            </header>

            {/* Article Content */}
            <article className="max-w-none">
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
          </div>

          {/* Sidebar with TOC */}
          <aside className="lg:col-span-1">
            <TableOfContents content={article.content} />
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