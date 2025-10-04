import { useEffect } from 'react';
import { Code, Database, Cloud, Zap, Edit3 } from 'lucide-react';
import { AuthorBio } from './AuthorBio';
import { AUTHOR_INFO } from '../../constants/author';
import { TECH_STACK, BLOG_FEATURES } from '../../constants/blog';
import { updateSEO, generateAboutSEO, generateStructuredData, insertStructuredData } from '../../utils/seo';

interface AboutPageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  // SEOメタタグを更新
  useEffect(() => {
    updateSEO(generateAboutSEO());
    
    // 構造化データを挿入
    const structuredData = generateStructuredData('website');
    insertStructuredData(structuredData);
  }, []);

  // アイコンを動的に生成する関数
  const getIcon = (iconName: string) => {
    const iconProps = { className: "h-6 w-6" };
    switch (iconName) {
      case 'Code':
        return <Code {...iconProps} />;
      case 'Edit3':
        return <Edit3 {...iconProps} />;
      case 'Database':
        return <Database {...iconProps} />;
      case 'Zap':
        return <Zap {...iconProps} />;
      default:
        return <Code {...iconProps} />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="mb-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            ← 戻る
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            著者について
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            このブログの技術的な背景と特徴についてご紹介します
          </p>
        </div>

        {/* 著者プロフィール */}
        <section className="mb-8">
          <AuthorBio {...AUTHOR_INFO} showDetailButton={false} />
        </section>

        {/* 技術スタック */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            技術スタック
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* フロントエンド */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                フロントエンド
              </h3>
                  <ul className="space-y-3">
                    {TECH_STACK.frontend.map((tech, index) => (
                  <li key={index}>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {tech.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {tech.description}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* バックエンド */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                バックエンド
              </h3>
                  <ul className="space-y-3">
                    {TECH_STACK.backend.map((tech, index) => (
                  <li key={index}>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {tech.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {tech.description}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ツール・インフラ */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Cloud className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                ツール・インフラ
              </h3>
              <ul className="space-y-3">
                {TECH_STACK.tools.map((tech, index) => (
                  <li key={index}>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {tech.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {tech.description}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ブログの特徴 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            このブログの特徴
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
              {BLOG_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
                    {getIcon(feature.iconName)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 開発理念 */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 md:p-8 border border-blue-200 dark:border-gray-600">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            開発理念
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              <strong className="text-gray-900 dark:text-gray-100">「シンプルは究極の洗練」</strong>をモットーに、
              複雑な技術を統合し、ユーザーにとって直感的で使いやすいブログを目指しています。
            </p>
            <p>
              最新のWeb技術を活用しながらも、<strong className="text-gray-900 dark:text-gray-100">読みやすさと親しみやすさ</strong>を
              最優先に設計しています。技術的な詳細は隠し、読者がコンテンツに集中できる環境を提供します。
            </p>
            <p>
              また、<strong className="text-gray-900 dark:text-gray-100">オープンソース精神</strong>に基づき、
              このブログの技術的な実装についても積極的に情報発信していきます。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
