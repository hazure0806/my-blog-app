import type { Article } from '../types/firebase';
import { getArticles } from '../lib/firestore';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemapUrls(articles: Article[]): SitemapUrl[] {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? (import.meta.env.VITE_SITE_URL || import.meta.env.VITE_VERCEL_URL || 'https://your-domain.vercel.app')
    : 'http://localhost:5173';
  
  const urls: SitemapUrl[] = [
    {
      loc: baseUrl,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/articles`,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/about`,
      changefreq: 'monthly',
      priority: 0.5
    }
  ];

  // 公開済み記事を追加
  const publishedArticles = articles.filter(article => article.status === 'published');
  publishedArticles.forEach(article => {
    urls.push({
      loc: `${baseUrl}/article/${article.id}`,
      lastmod: article.updatedAt?.toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.6
    });
  });

  return urls;
}

export function generateSitemapXML(urls: SitemapUrl[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `    <priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

// 動的にサイトマップを生成する関数（APIエンドポイント用）
export async function generateDynamicSitemap(): Promise<string> {
  try {
    const articles = await getArticles();
    const urls = generateSitemapUrls(articles);
    return generateSitemapXML(urls);
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    // エラー時は基本的なサイトマップを返す
    const basicUrls: SitemapUrl[] = [
      {
        loc: process.env.NODE_ENV === 'production' 
          ? (import.meta.env.VITE_SITE_URL || import.meta.env.VITE_VERCEL_URL || 'https://your-domain.vercel.app')
          : 'http://localhost:5173',
        changefreq: 'daily',
        priority: 1.0
      }
    ];
    return generateSitemapXML(basicUrls);
  }
}
