import React from 'react';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { AuthorBio } from './AuthorBio';
import { ShareButtons } from './ShareButtons';
import { TableOfContents } from './TableOfContents';
import { ArticleCard } from './ArticleCard';
import { Button } from '../ui/button';

const article = {
  title: 'React 19の新機能：Server Componentsとその活用方法',
  date: '2025年1月15日',
  readTime: '8分',
  category: 'React',
  tags: ['React', 'Server Components', 'フロントエンド', 'JavaScript'],
  content: `この記事では、React 19で導入された革新的なServer Componentsについて詳しく解説していきます。

## Server Componentsとは？

Server Componentsは、サーバー側でレンダリングされるReactコンポーネントで、従来のClient Componentsとは異なる動作をします。

### 主な特徴

- **ゼロバンドル**: Server Componentsはクライアントにバンドルされません
- **データベースアクセス**: 直接データベースやファイルシステムにアクセス可能
- **セキュリティ**: APIキーなどの機密情報を安全に扱えます

## 実装方法

基本的なServer Componentの実装例を見てみましょう：

\`\`\`tsx
// app/posts/page.tsx (Server Component)
import { db } from '@/lib/db'

export default async function PostsPage() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <h1>記事一覧</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
\`\`\`

### Client Componentsとの使い分け

Server Componentsを使う場面：
- データフェッチが必要な場合
- SEOが重要な静的コンテンツ
- 機密情報を扱う場合

Client Componentsを使う場面：
- ユーザーインタラクションが必要
- ブラウザAPIを使用する場合
- 状態管理が必要な場合

## パフォーマンスへの影響

Server Componentsを適切に使用することで、以下の改善が期待できます：

1. **初期ロード時間の短縮**: クライアントでのJavaScript実行が減る
2. **バンドルサイズの削減**: サーバーコンポーネントはバンドルされない
3. **Core Web Vitalsの向上**: FCP、LCPなどの指標が改善される

> **注意点**: Server ComponentsとClient Componentsの境界を適切に設計することが重要です。

## 実践的な使用例

実際のアプリケーションでServer Componentsを活用する例：

\`\`\`tsx
// app/dashboard/page.tsx
import { UserStats } from '@/components/UserStats'
import { RecentActivity } from '@/components/RecentActivity'
import { getCurrentUser } from '@/lib/auth'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  return (
    <main>
      <h1>ダッシュボード</h1>
      <UserStats userId={user.id} />
      <RecentActivity userId={user.id} />
    </main>
  )
}
\`\`\`

## まとめ

Server Componentsは、Reactアプリケーションのパフォーマンスとユーザーエクスペリエンスを大幅に改善する可能性を秘めています。適切に活用することで、より高速で効率的なWebアプリケーションを構築できるでしょう。

次回の記事では、Server ComponentsとSuspenseを組み合わせた高度なデータローディングパターンについて解説予定です。`,
  image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

const authorInfo = {
  name: '田中太郎',
  bio: 'フルスタック開発者として10年以上の経験を持ち、React、TypeScript、Node.jsを中心としたモダンWeb開発に情熱を注いでいます。最新のテクノロジートレンドを追いかけながら、実践的な知識を共有することを目標としています。',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
  social: {
    twitter: 'https://twitter.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'contact@example.com',
  },
};

const relatedArticles = [
  {
    title: 'Next.js App Routerによるモダンなフルスタック開発',
    excerpt: 'Next.js 13で導入されたApp Routerを使った最新の開発手法と、パフォーマンス最適化のベストプラクティス。',
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: '2025年1月10日',
    readTime: '15分',
    category: 'Next.js',
  },
  {
    title: 'TypeScriptの型システムを活用した保守性の高いコード設計',
    excerpt: 'TypeScriptの高度な型機能を使って、より安全で保守性の高いアプリケーションを構築する方法について説明します。',
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: '2025年1月12日',
    readTime: '12分',
    category: 'TypeScript',
  },
];

export function ArticlePage() {
  const renderContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
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
        
        return (
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
      });
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="mx-auto max-w-4xl px-4">
            <Button variant="ghost" className="text-white/90 hover:text-white mb-4">
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
                  {article.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{article.readTime}</span>
                </div>
              </div>
              
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
            </header>

            {/* Article Content */}
            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
              {renderContent(article.content)}
            </div>

            {/* Author Bio */}
            <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
              <AuthorBio {...authorInfo} />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            <ShareButtons url="https://example.com" title={article.title} />
          </aside>
        </div>

        {/* Related Articles */}
        <section className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            関連記事
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedArticles.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}