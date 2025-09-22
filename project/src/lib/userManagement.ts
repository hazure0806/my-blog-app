import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { User } from '../types/firebase';

const usersCollection = 'users';

// ユーザー情報を取得
export const getUserProfile = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = doc(db, usersCollection, uid);
    const userSnap = await getDoc(userDoc);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        uid: userSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        lastLoginAt: data.lastLoginAt?.toDate(),
      } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// ユーザー情報を作成（初回ログイン時）
export const createUserProfile = async (firebaseUser: any): Promise<User> => {
  const userData: Omit<User, 'createdAt' | 'lastLoginAt'> = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'ユーザー',
    photoURL: firebaseUser.photoURL,
    role: 'user', // デフォルトは一般ユーザー
  };

  const now = new Date();
  const userDoc = doc(db, usersCollection, firebaseUser.uid);
  
  await setDoc(userDoc, {
    ...userData,
    createdAt: now,
    lastLoginAt: now,
  });

  return {
    ...userData,
    createdAt: now,
    lastLoginAt: now,
  };
};

// ユーザー情報を更新
export const updateUserProfile = async (uid: string, updates: Partial<User>): Promise<void> => {
  const userDoc = doc(db, usersCollection, uid);
  const updateData = {
    ...updates,
    lastLoginAt: new Date(),
  };
  
  await updateDoc(userDoc, updateData);
};

// 管理者権限を付与
export const grantAdminRole = async (uid: string): Promise<void> => {
  await updateUserProfile(uid, { role: 'admin' });
};

// 管理者権限を削除
export const revokeAdminRole = async (uid: string): Promise<void> => {
  await updateUserProfile(uid, { role: 'user' });
};
