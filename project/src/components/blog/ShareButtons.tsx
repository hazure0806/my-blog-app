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
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
        この記事をシェア
      </h4>
      <div className="flex space-x-3">
        <a
          href={shareData.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Twitter className="h-5 w-5" />
        </a>
        <a
          href={shareData.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Facebook className="h-5 w-5" />
        </a>
        <a
          href={shareData.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Linkedin className="h-5 w-5" />
        </a>
        <button
          onClick={copyToClipboard}
          className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Link2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}