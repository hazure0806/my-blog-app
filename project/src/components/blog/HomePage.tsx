import React from 'react';
import { ArticleCard } from './ArticleCard';
import { AuthorBio } from './AuthorBio';
import { useArticles } from '../../hooks/useArticles';

const featuredArticle = {
  title: '毎日のコーヒータイムを特別にする5つの方法',
  excerpt: '忙しい日常の中で、コーヒータイムは私にとって大切なひととき。豆の選び方から淹れ方まで、毎日のコーヒーをもっと楽しむためのちょっとしたコツをシェアします。',
  image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
  date: '2025年1月20日',
  readTime: '8分',
  category: 'コーヒー',
  featured: true,
};

const articles = [
  {
    title: '栄養バランスを考えた一週間の食事プラン',
    excerpt: '忙しい毎日でも健康的な食事を続けるために、栄養士の友人に教わった簡単で美味しい食事プランをご紹介します。',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: '2025年1月18日',
    readTime: '10分',
    category: '栄養・健康',
  },
  {
    title: 'React 19の新機能：Server Componentsとその活用方法',
    excerpt: '最新のReact 19で導入されたServer Componentsについて、実際の開発現場での活用方法を交えて解説します。',
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: '2025年1月15日',
    readTime: '15分',
    category: 'テクノロジー',
  },
  {
    title: '週末の小さな冒険：近所のカフェ巡り記録',
    excerpt: '最近始めた週末のカフェ巡り。今回は地元で見つけた素敵なカフェ3軒をご紹介。それぞれの特色や雰囲気をレポートします。',
    image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: '2025年1月12日',
    readTime: '8分',
    category: '雑記',
  },
  {
    title: '在宅ワークの生産性を上げる環境づくり',
    excerpt: 'リモートワークが続く中で試行錯誤してきた、集中できる作業環境の作り方や時間管理のコツをまとめました。',
    image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: '2025年1月10日',
    readTime: '12分',
    category: 'ライフスタイル',
  },
  {
    title: 'TypeScriptの型システムを活用した保守性の高いコード設計',
    excerpt: 'TypeScriptの高度な型機能を使って、より安全で保守性の高いアプリケーションを構築する方法について説明します。',
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: '2025年1月8日',
    readTime: '14分',
    category: 'テクノロジー',
  },
  {
    title: '季節の変わり目に意識したい栄養素とレシピ',
    excerpt: '季節の変わり目は体調を崩しやすい時期。免疫力を高める栄養素と、簡単に作れる美味しいレシピをご紹介します。',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: '2025年1月5日',
    readTime: '12分',
    category: '栄養・健康',
  },
];

const authorInfo = {
  name: '田中太郎',
  bio: 'フルスタック開発者として働きながら、日々の生活で発見した小さな喜びや学びを記録しています。テクノロジー、コーヒー、栄養、ライフスタイルなど、興味のあることを自由に書いています。',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
  social: {
    twitter: 'https://twitter.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'contact@example.com',
  },
};

export function HomePage() {
  const { articles, loading, error } = useArticles();

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
  const otherArticles = publishedArticles.filter(article => article.id !== featuredArticle?.id);

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
            <ArticleCard {...featuredArticle} />
          </section>
        )}

        {/* Recent Articles Grid */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            記事一覧
          </h2>
          {otherArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherArticles.map((article) => (
                <ArticleCard key={article.id} {...article} />
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
          <AuthorBio {...authorInfo} />
        </section>
      </div>
    </main>
  );
}