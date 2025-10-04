import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  limit,
  Timestamp,
  increment 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Article, Author, Comment } from '../types/firebase';

// 記事関連の操作
export const articlesCollection = collection(db, 'articles');

export const getArticles = async (limitCount?: number) => {
  const q = limitCount 
    ? query(articlesCollection, orderBy('publishedAt', 'desc'), limit(limitCount))
    : query(articlesCollection, orderBy('publishedAt', 'desc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    publishedAt: doc.data().publishedAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Article[];
};

export const getArticle = async (id: string) => {
  const docRef = doc(articlesCollection, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      publishedAt: data.publishedAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Article;
  }
  return null;
};

export const createArticle = async (article: Omit<Article, 'id' | 'publishedAt' | 'updatedAt' | 'views'>) => {
  const now = new Date();
  
  // undefined値を除外してFirestoreに保存
  const cleanArticle = Object.fromEntries(
    Object.entries(article).filter(([_, value]) => value !== undefined)
  );
  
  const articleData = {
    ...cleanArticle,
    publishedAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
    views: 0,
  };
  
  const docRef = await addDoc(articlesCollection, articleData);
  return docRef.id;
};

export const updateArticle = async (id: string, updates: Partial<Article>) => {
  const docRef = doc(articlesCollection, id);
  
  // undefined値を除外してFirestoreに保存
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]) => value !== undefined)
  );
  
  const updateData = {
    ...cleanUpdates,
    updatedAt: Timestamp.fromDate(new Date()),
  };
  
  await updateDoc(docRef, updateData);
};

export const deleteArticle = async (id: string) => {
  const docRef = doc(articlesCollection, id);
  await deleteDoc(docRef);
};

// 閲覧数を増加させる関数
export const incrementArticleViews = async (id: string) => {
  try {
    const docRef = doc(articlesCollection, id);
    await updateDoc(docRef, {
      views: increment(1)
    });
    console.log('Views incremented successfully for article:', id);
  } catch (error) {
    console.error('Failed to increment views for article:', id, error);
    throw error;
  }
};

// 著者情報の取得
export const getAuthor = async (): Promise<Author | null> => {
  const authorDoc = doc(db, 'config', 'author');
  const authorSnap = await getDoc(authorDoc);
  
  if (authorSnap.exists()) {
    return authorSnap.data() as Author;
  }
  return null;
};

// コメント関連の操作
export const getComments = async (articleId: string) => {
  const commentsCollection = collection(db, 'comments');
  const q = query(
    commentsCollection, 
    where('articleId', '==', articleId),
    where('approved', '==', true),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Comment[];
};
