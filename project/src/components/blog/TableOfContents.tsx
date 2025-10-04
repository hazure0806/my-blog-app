import React, { useState, useEffect, useCallback } from 'react';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content?: string;
}

export function TableOfContents({ content = '' }: TableOfContentsProps) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [tocRight, setTocRight] = useState('32px');

  // 記事内容から見出しを抽出
  const extractHeadings = useCallback((markdownContent: string): TOCItem[] => {
    const lines = markdownContent.split('\n');
    const headings: TOCItem[] = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // 見出し1 (# )
      if (trimmedLine.startsWith('# ')) {
        const text = trimmedLine.replace('# ', '');
        const id = generateId(text);
        headings.push({ id, text, level: 1 });
      }
      // 見出し2 (## )
      else if (trimmedLine.startsWith('## ')) {
        const text = trimmedLine.replace('## ', '');
        const id = generateId(text);
        headings.push({ id, text, level: 2 });
      }
      // 見出し3 (### )
      else if (trimmedLine.startsWith('### ')) {
        const text = trimmedLine.replace('### ', '');
        const id = generateId(text);
        headings.push({ id, text, level: 3 });
      }
    });
    
    return headings;
  }, []);

  // 見出しテキストからIDを生成（日本語対応）
  const generateId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\s-]/g, '') // 日本語文字を保持
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') // 連続するハイフンを単一に
      .replace(/^-|-$/g, '') // 先頭・末尾のハイフンを削除
      .trim();
  };

  // スクロール位置に基づいてアクティブな見出しを検出
  const updateActiveHeading = useCallback(() => {
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id]');
    const scrollPosition = window.scrollY + 100;

    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i] as HTMLElement;
      if (heading.offsetTop <= scrollPosition) {
        setActiveId(heading.id);
        break;
      }
    }

    // 目次の固定表示判定（記事コンテンツエリアに入ったら固定）
    const tocElement = document.getElementById('toc-container');
    const articleContent = document.querySelector('article');
    const container = document.querySelector('.max-w-6xl');
    
    if (tocElement && articleContent && container) {
      const containerRect = container.getBoundingClientRect();
      const articleRect = articleContent.getBoundingClientRect();
      
      // 記事コンテンツの上部に到達したら固定表示
      if (articleRect.top <= 100) {
        setIsFixed(true);
        
        // 記事コンテナの右端に合わせて位置を計算
        const viewportWidth = window.innerWidth;
        const containerRight = viewportWidth - containerRect.right;
        const newRight = Math.max(32, containerRight + 16); // 最小32px、記事右端+16px
        setTocRight(`${newRight}px`);
      } else {
        setIsFixed(false);
      }
    }
  }, []);

  useEffect(() => {
    const headings = extractHeadings(content);
    setItems(headings);
    
    // デバッグ用：生成された見出しとIDをコンソールに出力
    console.log('Generated TOC items:', headings);
  }, [content, extractHeadings]);

  useEffect(() => {
    // 見出しにIDを設定
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach((heading) => {
      const text = heading.textContent || '';
      const id = generateId(text);
      heading.id = id;
    });

    // スクロールイベントリスナー
    window.addEventListener('scroll', updateActiveHeading);
    updateActiveHeading(); // 初期化

    return () => {
      window.removeEventListener('scroll', updateActiveHeading);
    };
  }, [items, updateActiveHeading]);

  // 目次が空の場合は表示しない
  if (items.length === 0) {
    return null;
  }

  return (
    <div 
      id="toc-container"
      className={`bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg mb-8 transition-all duration-300 ${
        isFixed 
          ? 'fixed top-20 w-64 z-40 shadow-lg' 
          : 'relative'
      } hidden lg:block`}
      style={isFixed ? {
        right: tocRight
      } : {}}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            目次 ({items.length})
          </span>
        </div>
        <span className="text-gray-500 dark:text-gray-400 text-lg">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      
      {isOpen && (
        <div className={`px-4 pb-4 ${isFixed ? 'max-h-[calc(100vh-200px)] overflow-y-auto' : ''}`}>
          <nav className="space-y-1">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    element.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
                className={`block text-sm transition-colors py-2 px-3 rounded-md hover:bg-white dark:hover:bg-gray-700/50 ${
                  activeId === item.id
                    ? 'text-blue-600 dark:text-blue-400 font-medium bg-white dark:bg-gray-700/50 border-l-3 border-blue-600 dark:border-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                } ${
                  item.level === 2 ? 'ml-4' : 
                  item.level === 3 ? 'ml-8' : ''
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}