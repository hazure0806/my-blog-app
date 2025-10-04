import type { Article } from '../types/firebase';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export function updateSEO({
  title = 'Gaku-Log - 学びと発見の記録',
  description = '日々の発見や学び、興味のあることを自由に綴っているブログです。技術、ライフスタイル、学習記録などを中心に更新しています。',
  keywords = ['ブログ', '学習', '技術', 'ライフスタイル'],
  image = 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200',
  url = window.location.href,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Gaku-Log'
}: SEOProps = {}) {
  // 基本メタタグ
  updateMetaTag('title', title);
  updateMetaTag('meta', 'description', description);
  updateMetaTag('meta', 'keywords', keywords.join(', '));
  
  // OGP (Open Graph Protocol)
  updateMetaTag('meta', 'og:title', title, { property: 'og:title' });
  updateMetaTag('meta', 'og:description', description, { property: 'og:description' });
  updateMetaTag('meta', 'og:image', image, { property: 'og:image' });
  updateMetaTag('meta', 'og:url', url, { property: 'og:url' });
  updateMetaTag('meta', 'og:type', type, { property: 'og:type' });
  updateMetaTag('meta', 'og:site_name', 'Gaku-Log', { property: 'og:site_name' });
  updateMetaTag('meta', 'og:locale', 'ja_JP', { property: 'og:locale' });
  
  // Twitter Card
  updateMetaTag('meta', 'twitter:card', 'summary_large_image', { name: 'twitter:card' });
  updateMetaTag('meta', 'twitter:title', title, { name: 'twitter:title' });
  updateMetaTag('meta', 'twitter:description', description, { name: 'twitter:description' });
  updateMetaTag('meta', 'twitter:image', image, { name: 'twitter:image' });
  
  // 記事固有のメタタグ
  if (type === 'article' && publishedTime) {
    updateMetaTag('meta', 'article:published_time', publishedTime, { property: 'article:published_time' });
    updateMetaTag('meta', 'article:author', author, { property: 'article:author' });
  }
  
  if (modifiedTime) {
    updateMetaTag('meta', 'article:modified_time', modifiedTime, { property: 'article:modified_time' });
  }
}

function updateMetaTag(tag: 'title' | 'meta', name: string, content?: string, attributes: Record<string, string> = {}) {
  if (tag === 'title') {
    document.title = name;
    return;
  }
  
  const selector = attributes.property ? 
    `meta[property="${attributes.property}"]` : 
    `meta[name="${name}"]`;
  
  let element = document.querySelector(selector) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    if (attributes.property) {
      element.setAttribute('property', attributes.property);
    } else {
      element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }
  
  if (content) {
    element.content = content;
  }
}

export function generateArticleSEO(article: Article): SEOProps {
  const baseUrl = import.meta.env.VITE_SITE_URL || import.meta.env.VITE_VERCEL_URL || window.location.origin;
  const articleUrl = `${baseUrl}/article/${article.id}`;
  
  // 記事の説明文を生成（内容の最初の150文字程度）
  const description = article.content
    .replace(/[#*`]/g, '') // Markdown記法を除去
    .replace(/\n+/g, ' ') // 改行を空白に変換
    .trim()
    .substring(0, 150) + (article.content.length > 150 ? '...' : '');
  
  return {
    title: `${article.title} | Gaku-Log`,
    description: description || `${article.title} - Gaku-Logでの学習記録`,
    keywords: article.tags || ['ブログ', '学習'],
    image: article.imageUrl || 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200',
    url: articleUrl,
    type: 'article',
    publishedTime: article.publishedAt?.toISOString(),
    modifiedTime: article.updatedAt?.toISOString(),
    author: 'Gaku-Log'
  };
}

export function generateHomeSEO(): SEOProps {
  return {
    title: 'Gaku-Log - 学びと発見の記録',
    description: '日々の発見や学び、興味のあることを自由に綴っているブログです。技術、ライフスタイル、学習記録などを中心に更新しています。',
    keywords: ['ブログ', '学習', '技術', 'ライフスタイル', '日記'],
    type: 'website'
  };
}

export function generateArticlesListSEO(): SEOProps {
  return {
    title: '記事一覧 | Gaku-Log',
    description: 'Gaku-Logの記事一覧ページです。技術、ライフスタイル、学習記録など様々なトピックの記事を掲載しています。',
    keywords: ['記事一覧', 'ブログ', '学習', '技術'],
    type: 'website'
  };
}

export function generateAboutSEO(): SEOProps {
  return {
    title: 'このブログについて | Gaku-Log',
    description: 'Gaku-Logについての説明ページです。このブログの目的や著者について紹介しています。',
    keywords: ['このブログについて', 'Gaku-Log', '著者'],
    type: 'website'
  };
}

// JSON-LD構造化データの生成
export function generateStructuredData(type: 'website' | 'article' | 'blog', data?: any) {
  const baseUrl = import.meta.env.VITE_SITE_URL || import.meta.env.VITE_VERCEL_URL || window.location.origin;
  
  if (type === 'website') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Gaku-Log',
      alternateName: 'Gaku-Log - 学びと発見の記録',
      url: baseUrl,
      description: '日々の発見や学び、興味のあることを自由に綴っているブログです。技術、ライフスタイル、学習記録などを中心に更新しています。',
      publisher: {
        '@type': 'Person',
        name: 'Gaku-Log'
      },
      inLanguage: 'ja-JP'
    };
  }
  
  if (type === 'blog') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Gaku-Log',
      description: '日々の発見や学び、興味のあることを自由に綴っているブログです。',
      url: baseUrl,
      publisher: {
        '@type': 'Person',
        name: 'Gaku-Log'
      },
      inLanguage: 'ja-JP'
    };
  }
  
  if (type === 'article' && data) {
    const article = data as Article;
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.content
        .replace(/[#*`]/g, '')
        .replace(/\n+/g, ' ')
        .trim()
        .substring(0, 150) + (article.content.length > 150 ? '...' : ''),
      image: article.imageUrl || 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200',
      url: `${baseUrl}/article/${article.id}`,
      datePublished: article.publishedAt?.toISOString(),
      dateModified: article.updatedAt?.toISOString(),
      author: {
        '@type': 'Person',
        name: 'Gaku-Log'
      },
      publisher: {
        '@type': 'Person',
        name: 'Gaku-Log'
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/article/${article.id}`
      },
      articleSection: article.category || '未分類',
      keywords: article.tags?.join(', ') || '',
      inLanguage: 'ja-JP',
      wordCount: article.content.length,
      timeRequired: `PT${article.readTime || 5}M`
    };
  }
  
  return null;
}

export function insertStructuredData(data: any) {
  // 既存の構造化データを削除
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // 新しい構造化データを挿入
  if (data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
}
