import React from 'react';
import { Calendar, Clock, Lock } from 'lucide-react';
import type { Article } from '../../types/firebase';

interface ArticleCardProps extends Partial<Article> {
  isPaid?: boolean;
}

export function ArticleCard({ 
  title, 
  excerpt, 
  imageUrl, 
  publishedAt, 
  readTime, 
  category, 
  isPaid = false,
  featured = false 
}: ArticleCardProps) {
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
    <article className={`group cursor-pointer ${
      featured 
        ? 'md:col-span-2 md:row-span-2' 
        : ''
    }`}>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full">
        <div className="relative">
          <img
            src={imageUrl || 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800'}
            alt={title || ''}
            className={`w-full object-cover ${
              featured ? 'h-64 md:h-80' : 'h-48'
            }`}
          />
          {isPaid && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white p-2 rounded-lg shadow-sm">
              <Lock className="h-4 w-4" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              {category || '未分類'}
            </span>
          </div>
        </div>
        
        <div className={`p-6 ${featured ? 'md:p-8' : ''}`}>
          <h3 className={`font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 ${
            featured ? 'text-2xl md:text-3xl' : 'text-lg'
          }`}>
            {title || 'タイトルなし'}
          </h3>
          
          <p className={`text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed ${
            featured ? 'text-base' : 'text-sm'
          }`}>
            {excerpt || '概要がありません'}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatReadTime(readTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}