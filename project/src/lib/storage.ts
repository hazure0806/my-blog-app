import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { storage } from './firebase';

export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, `images/${path}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const deleteImage = async (path: string): Promise<void> => {
  const imageRef = ref(storage, `images/${path}`);
  await deleteObject(imageRef);
};

export const generateImagePath = (fileName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = fileName.split('.').pop();
  return `${timestamp}_${randomString}.${extension}`;
};
