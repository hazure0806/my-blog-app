import React, { useState } from 'react';
import { Search, Filter, Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { ArticleCard } from './ArticleCard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ArticlesListPageProps {
  onBack: () => void;
}

const allArticles = [
  {
    title: '毎日のコーヒータイムを特別にする5つの方法',
    excerpt: '忙しい日常の中で、コーヒータイムは私にとって大切なひととき。豆の選び方から淹れ方まで、毎日のコーヒーをもっと楽しむためのちょっとしたコツをシェアします。',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: '2025年1月20日',
    readTime: '8分',
    category: 'コーヒー',
  },
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
  {
    title: '朝のルーティンを見直して1日を充実させる方法',
    excerpt: '朝の過ごし方を変えるだけで、1日全体の質が向上します。実際に試して効果があった朝のルーティンをご紹介。',
    image: 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: '2025年1月3日',
    readTime: '9分',
    category: 'ライフスタイル',
  },
  {
    title: 'Next.js App Routerによるモダンなフルスタック開発',
    excerpt: 'Next.js 13で導入されたApp Routerを使った最新の開発手法と、パフォーマンス最適化のベストプラクティス。',
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: '2024年12月28日',
    readTime: '18分',
    category: 'テクノロジー',
  },
  {
    title: '冬の温かいドリンクレシピ集',
    excerpt: '寒い季節にぴったりの温かいドリンクレシピをまとめました。コーヒーベースからハーブティーまで、心も体も温まる一杯を。',
    image: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: '2024年12月25日',
    readTime: '11分',
    category: 'コーヒー',
  },
  {
    title: '年末年始の食べ過ぎをリセットする栄養戦略',
    excerpt: '年末年始の食べ過ぎで体が重い...そんな時に役立つ、体をリセットする栄養戦略と簡単レシピをご紹介します。',
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: '2024年12月22日',
    readTime: '13分',
    category: '栄養・健康',
  },
  {
    title: '2024年を振り返って：今年学んだこと',
    excerpt: '2024年も残りわずか。今年1年間で学んだこと、挑戦したこと、来年に向けての目標について振り返ってみました。',
    image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: '2024年12月20日',
    readTime: '7分',
    category: '雑記',
  },
];

const categories = ['すべて', 'テクノロジー', 'ライフスタイル', 'コーヒー', '栄養・健康', '雑記'];

export function ArticlesListPage({ onBack }: ArticlesListPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [sortBy, setSortBy] = useState('newest');

  const filteredArticles = allArticles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'すべて' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'readTime') {
        return parseInt(a.readTime) - parseInt(b.readTime);
      }
      return 0;
    });

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
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <ArticleCard key={index} {...article} />
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

        {/* Load More Button (for future pagination) */}
        {filteredArticles.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" className="px-8">
              さらに記事を読み込む
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}