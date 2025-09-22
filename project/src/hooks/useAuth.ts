import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  AuthError 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserProfile, createUserProfile, updateUserProfile } from '../lib/userManagement';
import type { User } from '../types/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Firestoreからユーザー情報を取得
          let userProfile = await getUserProfile(firebaseUser.uid);
          
          if (!userProfile) {
            // 初回ログインの場合、ユーザープロフィールを作成
            userProfile = await createUserProfile(firebaseUser);
          } else {
            // 既存ユーザーの場合、最終ログイン時刻を更新
            await updateUserProfile(firebaseUser.uid, {});
          }
          
          setUser(userProfile);
        } catch (err) {
          console.error('Error handling user profile:', err);
          setError('ユーザー情報の取得に失敗しました');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
      throw error;
    }
  };

  const isAdmin = user?.role === 'admin';

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAdmin,
    isAuthenticated: !!user
  };
}
