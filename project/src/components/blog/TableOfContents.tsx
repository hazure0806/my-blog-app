import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // In a real implementation, this would parse the article content
    // For demo purposes, we'll use mock data
    const mockTOC: TOCItem[] = [
      { id: 'intro', text: 'はじめに', level: 1 },
      { id: 'setup', text: '環境セットアップ', level: 1 },
      { id: 'install', text: 'パッケージのインストール', level: 2 },
      { id: 'config', text: '設定ファイルの作成', level: 2 },
      { id: 'implementation', text: '実装方法', level: 1 },
      { id: 'basic', text: '基本的な使い方', level: 2 },
      { id: 'advanced', text: 'より高度な機能', level: 2 },
      { id: 'conclusion', text: 'まとめ', level: 1 },
    ];
    setItems(mockTOC);
  }, []);

  return (
    <div className="sticky top-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-4 text-left"
      >
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <List className="h-4 w-4" />
          目次
        </h3>
        <span className="text-gray-500 dark:text-gray-400">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      
      {isOpen && (
        <nav className="space-y-2">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-sm transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
                activeId === item.id
                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'text-gray-600 dark:text-gray-300'
              } ${item.level === 2 ? 'ml-4' : ''}`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}