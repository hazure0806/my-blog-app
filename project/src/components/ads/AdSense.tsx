import React, { useEffect, useRef } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adStyle?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

export function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  adStyle = { display: 'block' }, 
  className = '',
  responsive = true 
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adLoaded = useRef(false);

  useEffect(() => {
    // AdSenseスクリプトが読み込まれているかチェック
    if (typeof window !== 'undefined' && (window as any).adsbygoogle && !adLoaded.current) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        adLoaded.current = true;
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  return (
    <div 
      ref={adRef}
      className={`adsense-container ${className}`}
      style={{ 
        minHeight: '250px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        margin: '16px 0',
        ...adStyle 
      }}
    >
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // 実際のAdSense Publisher IDに変更
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

// 広告ユニットの種類別コンポーネント
export function HeaderAd() {
  return (
    <AdSense 
      adSlot="1234567890" // 実際の広告スロットIDに変更
      adFormat="horizontal"
      className="header-ad"
      adStyle={{ 
        width: '100%', 
        height: '90px',
        margin: '16px 0',
        backgroundColor: '#f5f5f5'
      }}
    />
  );
}

export function SidebarAd() {
  return (
    <AdSense 
      adSlot="1234567891" // 実際の広告スロットIDに変更
      adFormat="vertical"
      className="sidebar-ad"
      adStyle={{ 
        width: '300px', 
        height: '600px',
        margin: '16px 0'
      }}
    />
  );
}

export function InArticleAd() {
  return (
    <AdSense 
      adSlot="1234567892" // 実際の広告スロットIDに変更
      adFormat="rectangle"
      className="in-article-ad"
      adStyle={{ 
        width: '100%', 
        height: '250px',
        margin: '32px 0',
        maxWidth: '728px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    />
  );
}

export function ArticleListAd() {
  return (
    <AdSense 
      adSlot="1234567893" // 実際の広告スロットIDに変更
      adFormat="rectangle"
      className="article-list-ad"
      adStyle={{ 
        width: '100%', 
        height: '250px',
        margin: '24px 0',
        backgroundColor: '#fafafa'
      }}
    />
  );
}

export function FooterAd() {
  return (
    <AdSense 
      adSlot="1234567894" // 実際の広告スロットIDに変更
      adFormat="horizontal"
      className="footer-ad"
      adStyle={{ 
        width: '100%', 
        height: '90px',
        margin: '16px 0',
        backgroundColor: '#f8f8f8'
      }}
    />
  );
}
