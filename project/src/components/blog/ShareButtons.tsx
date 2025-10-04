import React from 'react';
import { Twitter, Facebook, Linkedin, Link2 } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const shareData = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // You might want to show a toast notification here
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-lg">
        この記事をシェア
      </h4>
      <div className="flex items-center space-x-4">
        <a
          href={shareData.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md"
        >
          <Twitter className="h-5 w-5" />
        </a>
        <a
          href={shareData.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md"
        >
          <Facebook className="h-5 w-5" />
        </a>
        <a
          href={shareData.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md"
        >
          <Linkedin className="h-5 w-5" />
        </a>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          <Link2 className="h-4 w-4" />
          リンクをコピー
        </button>
      </div>
    </div>
  );
}