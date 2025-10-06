import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Save, Send, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageUpload, ThumbnailPreview } from '../ui/image-upload';
import { useArticles } from '../../hooks/useArticles';
import { useImageUpload } from '../../hooks/useImageUpload';
import { generateImagePath, uploadImage } from '../../lib/storage';

interface MarkdownEditorProps {
  onBackToDashboard?: () => void;
  editingArticleId?: string; // 編集モード用の記事ID
}

export function MarkdownEditor({ onBackToDashboard, editingArticleId }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [title, setTitle] = useState('新しい記事のタイトル');
  const [content, setContent] = useState(`# はじめに

この記事では、最新のWebテクノロジーについて詳しく解説していきます。

## 目次

1. 基本概念の理解
2. 実装方法
3. ベストプラクティス

## 基本概念の理解

まずは基本的な概念から始めましょう。

\`\`\`javascript
const greeting = "こんにちは、世界！";
console.log(greeting);
\`\`\`

## 実装方法

実際のコードを見てみましょう：

- 第一ステップ：環境のセットアップ
- 第二ステップ：基本実装
- 第三ステップ：テストとデバッグ

> **重要**: パフォーマンスを考慮した実装を心がけましょう。

## まとめ

今回学んだポイント：
- 効率的なコーディング手法
- モダンな開発環境の構築
- 継続的なスキルアップの重要性`);
  
  const [category, setCategory] = useState('テクノロジー');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [showThumbnailUpload, setShowThumbnailUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { addArticle, editArticle, fetchArticle } = useArticles();
  const { uploading: imageUploading, error: imageError } = useImageUpload();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 編集モード用のデータ読み込み
  useEffect(() => {
    const loadArticleForEdit = async () => {
      if (!editingArticleId) return;
      
      try {
        setLoading(true);
        setError(null);
        const article = await fetchArticle(editingArticleId);
        
        if (article) {
          setTitle(article.title);
          setContent(article.content);
          setCategory(article.category);
          if (article.imageUrl) {
            setThumbnailUrl(article.imageUrl);
          }
        } else {
          setError('記事が見つかりません');
        }
      } catch (err) {
        console.error('Error loading article for edit:', err);
        setError('記事の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadArticleForEdit();
  }, [editingArticleId, fetchArticle]);

  // 記事の概要を生成（マークダウンの最初の段落から）
  const generateExcerpt = (markdown: string) => {
    const lines = markdown.split('\n');
    const firstParagraph = lines.find(line => 
      line.trim() && 
      !line.startsWith('#') && 
      !line.startsWith('```') &&
      !line.startsWith('-') &&
      !line.startsWith('*') &&
      !line.startsWith('>')
    );
    return firstParagraph ? firstParagraph.substring(0, 100) + '...' : '概要がありません';
  };

  // 読了時間を計算（1分間に200文字として計算）
  const calculateReadTime = (content: string) => {
    const wordCount = content.replace(/\s/g, '').length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  // スラッグを生成
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // 本文画像のアップロード処理
  const handleContentImageUpload = async (file: File) => {
    try {
      const fileName = generateImagePath(file.name);
      const downloadURL = await uploadImage(file, `content/${fileName}`);
      
      // 現在のカーソル位置にMarkdown記法を挿入
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const imageMarkdown = `![画像](${downloadURL})\n`;
        
        const newContent = 
          content.substring(0, start) + 
          imageMarkdown + 
          content.substring(end);
        
        setContent(newContent);
        
        // カーソル位置を画像記法の後に移動
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
        }, 0);
      }
    } catch (err) {
      console.error('Content image upload error:', err);
      setError('画像のアップロードに失敗しました');
    }
  };

  // サムネイル画像のアップロード処理
  const handleThumbnailUpload = async (file: File) => {
    try {
      const fileName = generateImagePath(file.name);
      const downloadURL = await uploadImage(file, `thumbnail/${fileName}`);
      setThumbnailUrl(downloadURL);
      setShowThumbnailUpload(false);
    } catch (err) {
      console.error('Thumbnail upload error:', err);
      setError('サムネイル画像のアップロードに失敗しました');
    }
  };

  // サムネイル画像の削除
  const handleThumbnailRemove = () => {
    setThumbnailUrl('');
  };

  const handleSaveDraft = async () => {
    if (!title.trim() || !content.trim()) {
      setError('タイトルと内容を入力してください');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const articleData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: generateExcerpt(content),
        author: '14nn023@gmail.com',
        status: 'draft' as const,
        category: category,
        tags: [],
        readTime: calculateReadTime(content),
        featured: false,
        slug: generateSlug(title),
        ...(thumbnailUrl && { imageUrl: thumbnailUrl })
      };

      if (editingArticleId) {
        // 編集モード
        await editArticle(editingArticleId, articleData);
        alert('下書きを更新しました');
      } else {
        // 新規作成モード
        await addArticle(articleData);
        alert('下書きを保存しました');
      }
    } catch (err) {
      setError('保存に失敗しました');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      setError('タイトルと内容を入力してください');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const articleData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: generateExcerpt(content),
        author: '14nn023@gmail.com',
        status: 'published' as const,
        category: category,
        tags: [],
        readTime: calculateReadTime(content),
        featured: false,
        slug: generateSlug(title),
        ...(thumbnailUrl && { imageUrl: thumbnailUrl })
      };

      if (editingArticleId) {
        // 編集モード
        await editArticle(editingArticleId, articleData);
        alert('記事を更新しました');
      } else {
        // 新規作成モード
        await addArticle(articleData);
        alert('記事を公開しました');
      }
      
      if (onBackToDashboard) {
        onBackToDashboard();
      }
    } catch (err) {
      setError('公開に失敗しました');
      console.error('Publish error:', err);
    } finally {
      setSaving(false);
    }
  };

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

  const renderMarkdownPreview = (content: string) => {
    // より簡潔で確実なマークダウン変換
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
          elements.push(
            <div key={i} className="my-4">
              <img
                src={imageUrl}
                alt={altText || '画像'}
                className="w-full h-auto rounded-lg shadow-lg"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  console.error('Image load error:', imageUrl);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              {altText && altText !== '画像' && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1 italic">
                  {altText}
                </p>
              )}
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
      const processedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-600 dark:text-blue-400">$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
      
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

  // ローディング状態の表示
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">記事を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            記事エディタ
          </h1>
          <div className="flex items-center space-x-3">
            {onBackToDashboard && (
              <Button onClick={onBackToDashboard} variant="ghost" className="gap-2">
                ← ダッシュボードに戻る
              </Button>
            )}
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'プレビューを隠す' : 'プレビューを表示'}
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-2"
              onClick={handleSaveDraft}
              disabled={saving}
            >
              <Save className="h-4 w-4" />
              {saving ? '保存中...' : '下書き保存'}
            </Button>
            <Button 
              size="sm" 
              className="gap-2"
              onClick={handlePublish}
              disabled={saving}
            >
              <Send className="h-4 w-4" />
              {saving ? '公開中...' : '公開する'}
            </Button>
          </div>
        </div>
      </header>

      {/* Title Input */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold border-none p-0 h-auto focus:ring-0 bg-transparent w-full"
              placeholder="記事のタイトルを入力..."
            />
            <div className="flex gap-4 items-center mt-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="テクノロジー">テクノロジー</option>
                <option value="コーヒー">コーヒー</option>
                <option value="栄養・健康">栄養・健康</option>
                <option value="雑記">雑記</option>
                <option value="ライフスタイル">ライフスタイル</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowThumbnailUpload(!showThumbnailUpload)}
                className="gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                サムネイル画像
              </Button>
            </div>
          </div>
          
          {/* サムネイル画像プレビュー */}
          {thumbnailUrl && (
            <div className="w-32 h-24">
              <ThumbnailPreview
                imageUrl={thumbnailUrl}
                onRemove={handleThumbnailRemove}
                className="w-full h-full"
              />
            </div>
          )}
        </div>

        {/* サムネイル画像アップロード */}
        {showThumbnailUpload && (
          <div className="mt-4">
            <ImageUpload
              onImageUploaded={handleThumbnailUpload}
              uploading={imageUploading}
              error={imageError}
              variant="thumbnail"
              placeholder="サムネイル画像をアップロード"
              className="max-w-md"
            />
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Markdown Input */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-900`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Markdown</h3>
              <ImageUpload
                onImageUploaded={handleContentImageUpload}
                uploading={imageUploading}
                error={imageError}
                variant="content"
                placeholder="本文画像をアップロード"
                className="inline-block"
              />
            </div>
          </div>
          <div className="flex-1 p-4">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full font-mono text-sm border-none p-0 resize-none focus:ring-0 bg-transparent"
              placeholder="記事の内容をMarkdown形式で入力してください..."
            />
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 flex flex-col bg-white dark:bg-gray-900">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">プレビュー</h3>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {renderMarkdownPreview(content)}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}