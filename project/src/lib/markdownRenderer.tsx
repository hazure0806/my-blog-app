import React from 'react';

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

export const renderMarkdown = (content: string): JSX.Element[] => {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // 見出し1
    if (line.startsWith('# ')) {
      const text = line.replace('# ', '');
      const id = generateId(text);
      elements.push(
        <h1 key={i} id={id} className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-4 first:mt-0 leading-tight">
          {text}
        </h1>
      );
      i++;
      continue;
    }
    
    // 見出し2
    if (line.startsWith('## ')) {
      const text = line.replace('## ', '');
      const id = generateId(text);
      elements.push(
        <h2 key={i} id={id} className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-5 mb-3 leading-tight">
          {text}
        </h2>
      );
      i++;
      continue;
    }
    
    // 見出し3
    if (line.startsWith('### ')) {
      const text = line.replace('### ', '');
      const id = generateId(text);
      elements.push(
        <h3 key={i} id={id} className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2 leading-tight">
          {text}
        </h3>
      );
      i++;
      continue;
    }
    
    // コードブロック
    if (line.startsWith('```')) {
      const codeBlock = [];
      let j = i + 1;
      while (j < lines.length && !lines[j].startsWith('```')) {
        codeBlock.push(lines[j]);
        j++;
      }
      
      // 空のコードブロックの場合は適切な表示を行う
      const codeContent = codeBlock.join('\n');
      const isEmpty = codeContent.trim() === '';
      
      elements.push(
        <pre key={i} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-3 border border-gray-200 dark:border-gray-700">
          <code className="text-sm font-mono leading-tight">
            {isEmpty ? (
              <span className="text-gray-400 italic">（空のコードブロック）</span>
            ) : (
              codeContent
            )}
          </code>
        </pre>
      );
      
      // コードブロックの終了までスキップ
      i = j + 1;
      continue;
    }
    
    // 引用
    if (line.startsWith('> ')) {
      const quoteText = line.replace('> ', '');
      const processedQuoteText = quoteText
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-blue-600 dark:text-blue-400">$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
      
      elements.push(
        <blockquote key={i} className="border-l-4 border-blue-500 pl-4 py-2 my-3 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
          <p className="text-gray-700 dark:text-gray-300 leading-tight font-medium" dangerouslySetInnerHTML={{ __html: processedQuoteText }} />
        </blockquote>
      );
      i++;
      continue;
    }
    
    // リスト項目
    if (line.startsWith('- ')) {
      const listText = line.replace('- ', '');
      const processedListText = listText
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-blue-600 dark:text-blue-400">$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
      
      elements.push(
        <div key={i} className="flex items-center text-gray-700 dark:text-gray-300 leading-tight my-1 text-lg">
          <span className="text-blue-600 dark:text-blue-400 mr-3 text-lg">•</span>
          <span className="flex-1" dangerouslySetInnerHTML={{ __html: processedListText }} />
        </div>
      );
      i++;
      continue;
    }
    
    // 番号付きリスト
    if (line.match(/^\d+\. /)) {
      const match = line.match(/^(\d+)\. (.*)/);
      if (match) {
        const [, num, text] = match;
        const processedListText = text
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
          .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-blue-600 dark:text-blue-400">$1</code>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
        
        elements.push(
          <div key={i} className="flex items-center text-gray-700 dark:text-gray-300 leading-tight my-1 text-lg">
            <span className="text-blue-600 dark:text-blue-400 mr-2 font-medium min-w-[1.5rem]">
              {num}.
            </span>
            <span className="flex-1" dangerouslySetInnerHTML={{ __html: processedListText }} />
          </div>
        );
      }
      i++;
      continue;
    }
    
    // 画像
    if (line.match(/^!\[.*?\]\(.*?\)$/)) {
      const match = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (match) {
        const [, altText, imageUrl] = match;
        
        // 画像サイズの判定（altTextにサイズ情報が含まれている場合）
        let imageSizeClass = "max-w-full h-auto max-h-96 object-contain";
        let containerClass = "my-4 flex justify-center";
        
        if (altText.includes('small') || altText.includes('小')) {
          imageSizeClass = "max-w-xs h-auto object-contain";
        } else if (altText.includes('medium') || altText.includes('中')) {
          imageSizeClass = "max-w-md h-auto object-contain";
        } else if (altText.includes('large') || altText.includes('大')) {
          imageSizeClass = "max-w-2xl h-auto object-contain";
        } else if (altText.includes('full') || altText.includes('全幅')) {
          imageSizeClass = "w-full h-auto object-contain";
          containerClass = "my-4";
        }
        
        // altTextからサイズ指定を除去
        const cleanAltText = altText.replace(/\b(small|medium|large|full|小|中|大|全幅)\b/gi, '').trim();
        
        elements.push(
          <div key={i} className={containerClass}>
            <div className="relative max-w-full">
              <img
                src={imageUrl}
                alt={cleanAltText || '画像'}
                className={`${imageSizeClass} rounded-lg shadow-lg mx-auto`}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  console.error('Image load error:', imageUrl);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              {cleanAltText && cleanAltText !== '画像' && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                  {cleanAltText}
                </p>
              )}
            </div>
          </div>
        );
      }
      i++;
      continue;
    }
    
    // 空行
    if (line.trim() === '') {
      elements.push(<br key={i} />);
      i++;
      continue;
    }
    
    // 通常の段落
    let processedLine = line
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-blue-600 dark:text-blue-400">$1</code>');
    
    // 画像記法でないリンクのみを処理
    processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      // 画像記法でない場合のみリンクとして処理
      if (!match.startsWith('!')) {
        return `<a href="${url}" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
      }
      return match;
    });
    
    elements.push(
      <p 
        key={i} 
        className="text-gray-700 dark:text-gray-300 leading-tight mb-2 text-lg"
        dangerouslySetInnerHTML={{ __html: processedLine }}
      />
    );
    i++;
  }
  
  return elements;
};
