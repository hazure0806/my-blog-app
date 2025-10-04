import { useState, useEffect, useCallback } from 'react';
import { getArticles, getArticle, createArticle, updateArticle, deleteArticle } from '../lib/firestore';
import type { Article } from '../types/firebase';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedArticles = await getArticles();
      setArticles(fetchedArticles);
    } catch (err) {
      setError('記事の取得に失敗しました');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticle = useCallback(async (id: string) => {
    try {
      setError(null);
      const article = await getArticle(id);
      return article;
    } catch (err) {
      setError('記事の取得に失敗しました');
      console.error('Error fetching article:', err);
      return null;
    }
  }, []);

  const addArticle = async (articleData: Omit<Article, 'id' | 'publishedAt' | 'updatedAt' | 'views'>) => {
    try {
      setError(null);
      const articleId = await createArticle(articleData);
      await fetchArticles(); // 記事一覧を再取得
      return articleId;
    } catch (err) {
      setError('記事の作成に失敗しました');
      console.error('Error creating article:', err);
      throw err;
    }
  };

  const editArticle = async (id: string, updates: Partial<Article>) => {
    try {
      setError(null);
      await updateArticle(id, updates);
      await fetchArticles(); // 記事一覧を再取得
    } catch (err) {
      setError('記事の更新に失敗しました');
      console.error('Error updating article:', err);
      throw err;
    }
  };

  const removeArticle = async (id: string) => {
    try {
      setError(null);
      await deleteArticle(id);
      await fetchArticles(); // 記事一覧を再取得
    } catch (err) {
      setError('記事の削除に失敗しました');
      console.error('Error deleting article:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    fetchArticles,
    fetchArticle,
    addArticle,
    editArticle,
    removeArticle,
  };
}
