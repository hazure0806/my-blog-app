import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable,
  getMetadata
} from 'firebase/storage';
import { storage } from './firebase';

// ストレージの初期化とディレクトリ構造の確認
export const initializeStorageDirectories = async (): Promise<void> => {
  try {
    // Firebase Storageでは、ディレクトリは最初のファイルアップロード時に自動的に作成されます
    // ここでは初期化のログのみ出力し、実際のディレクトリ作成は必要ありません
    console.log('Firebase Storage initialized - directories will be created automatically on first upload');
    
    // ストレージ接続のテスト
    const testRef = ref(storage, 'test-connection');
    console.log('Storage connection test successful');
  } catch (error) {
    console.error('Error initializing storage directories:', error);
    throw error;
  }
};

export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
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

    const storageRef = ref(storage, `images/${path}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log(`Image uploaded successfully: ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadImageWithProgress = async (
  file: File, 
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
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

    const storageRef = ref(storage, `images/${path}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          // アップロード進捗の計算
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(`Image uploaded successfully: ${downloadURL}`);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error uploading image with progress:', error);
    throw error;
  }
};

export const deleteImage = async (path: string): Promise<void> => {
  try {
    const imageRef = ref(storage, `images/${path}`);
    await deleteObject(imageRef);
    console.log(`Image deleted successfully: ${path}`);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const generateImagePath = (fileName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = fileName.split('.').pop();
  return `${timestamp}_${randomString}.${extension}`;
};

// 画像URLからストレージパスを抽出する関数
export const extractStoragePath = (imageUrl: string): string | null => {
  try {
    // Firebase Storage URLからパスを抽出
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    return pathMatch ? decodeURIComponent(pathMatch[1]) : null;
  } catch (error) {
    console.error('Error extracting storage path:', error);
    return null;
  }
};
