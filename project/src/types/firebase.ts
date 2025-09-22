// Firebase関連の型定義

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  category: string;
  tags: string[];
  readTime: number; // 分単位
  views: number;
  featured: boolean;
  imageUrl?: string;
  slug: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface Comment {
  id: string;
  articleId: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  approved: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  lastLoginAt: Date;
}
