import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from './button';

interface ImageUploadProps {
  onImageUploaded: (file: File) => void;
  uploading: boolean;
  error: string | null;
  className?: string;
  variant?: 'content' | 'thumbnail';
  placeholder?: string;
}

export function ImageUpload({
  onImageUploaded,
  uploading,
  error,
  className = '',
  variant = 'content',
  placeholder = '画像をアップロード'
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

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

      // ファイルを直接渡す
      onImageUploaded(file);
    } catch (err) {
      console.error('File validation error:', err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive 
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              アップロード中...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            {variant === 'thumbnail' ? (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {placeholder}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                JPEG, PNG, WebP, GIF (最大5MB)
              </p>
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              ファイルを選択
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}

interface ThumbnailPreviewProps {
  imageUrl: string;
  onRemove: () => void;
  className?: string;
}

export function ThumbnailPreview({ imageUrl, onRemove, className = '' }: ThumbnailPreviewProps) {
  return (
    <div className={`relative group ${className}`}>
      <img
        src={imageUrl}
        alt="サムネイルプレビュー"
        className="w-full h-48 object-cover rounded-lg"
      />
      <Button
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
