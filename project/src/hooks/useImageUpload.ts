import { useState } from 'react';
import { uploadImage, generateImagePath } from '../lib/storage';

interface UseImageUploadReturn {
  uploadImageToStorage: (file: File, type: 'content' | 'thumbnail') => Promise<string>;
  uploading: boolean;
  error: string | null;
}

export function useImageUpload(): UseImageUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImageToStorage = async (file: File, type: 'content' | 'thumbnail'): Promise<string> => {
    try {
      setUploading(true);
      setError(null);

      // ファイル形式の検証
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('サポートされている画像形式は JPEG, PNG, WebP, GIF です');
      }

      // ファイルサイズの検証（5MB制限）
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('ファイルサイズは5MB以下にしてください');
      }

      // 画像パスの生成
      const fileName = generateImagePath(file.name);
      const path = `${type}/${fileName}`;

      // Firebase Storageにアップロード
      const downloadURL = await uploadImage(file, path);
      
      return downloadURL;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '画像のアップロードに失敗しました';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImageToStorage,
    uploading,
    error
  };
}
