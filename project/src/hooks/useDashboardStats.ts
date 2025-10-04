import { useState, useEffect } from 'react';
import { getArticles } from '../lib/firestore';
import type { Article } from '../types/firebase';

export interface DashboardStats {
  totalViews: number;
  monthlyViews: number;
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  avgReadTime: string;
  recentArticles: Array<{
    id: string;
    title: string;
    views: number;
    publishedAt: string;
    status: 'published' | 'draft';
  }>;
  topArticles: Array<{
    id: string;
    title: string;
    views: number;
  }>;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const articles = await getArticles();
        
        // 統計データを計算
        const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
        
        // 今月の記事を取得（簡易版：過去30日）
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const monthlyArticles = articles.filter(article => 
          article.publishedAt && article.publishedAt >= thirtyDaysAgo
        );
        const monthlyViews = monthlyArticles.reduce((sum, article) => sum + article.views, 0);
        
        const publishedArticles = articles.filter(article => article.status === 'published');
        const draftArticles = articles.filter(article => article.status === 'draft');
        
        // 平均読了時間を計算
        const avgReadTimeMinutes = publishedArticles.length > 0 
          ? Math.round(publishedArticles.reduce((sum, article) => sum + article.readTime, 0) / publishedArticles.length)
          : 0;
        const avgReadTime = `${avgReadTimeMinutes}分`;
        
        // 最近の記事（最新5件）
        const recentArticles = articles
          .slice(0, 5)
          .map(article => ({
            id: article.id,
            title: article.title,
            views: article.views,
            publishedAt: article.publishedAt 
              ? article.publishedAt.toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : '',
            status: article.status
          }));
        
        // 人気記事ランキング（閲覧数順、上位5件）
        const topArticles = articles
          .filter(article => article.status === 'published')
          .sort((a, b) => b.views - a.views)
          .slice(0, 5)
          .map(article => ({
            id: article.id,
            title: article.title,
            views: article.views
          }));
        
        setStats({
          totalViews,
          monthlyViews,
          totalArticles: articles.length,
          publishedArticles: publishedArticles.length,
          draftArticles: draftArticles.length,
          avgReadTime,
          recentArticles,
          topArticles
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('統計データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // 空の依存配列でマウント時のみ実行

  return { stats, loading, error };
}

