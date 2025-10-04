export interface AdConfig {
  enabled: boolean;
  adSenseEnabled: boolean;
  affiliateEnabled: boolean;
  sponsorEnabled: boolean;
  adSenseClientId: string;
  adSlots: {
    header: string;
    sidebar: string;
    inArticle: string;
    articleList: string;
    footer: string;
  };
  displaySettings: {
    showOnHomePage: boolean;
    showOnArticlePage: boolean;
    showOnArticleListPage: boolean;
    showOnAboutPage: boolean;
    inArticleFrequency: number; // 記事内で何段落ごとに広告を表示するか
  };
  styleSettings: {
    backgroundColor: string;
    borderColor: string;
    borderRadius: number;
    margin: number;
  };
}

// デフォルトの広告設定
export const defaultAdConfig: AdConfig = {
  enabled: true,
  adSenseEnabled: false, // 初期は無効（AdSense承認後に有効化）
  affiliateEnabled: false,
  sponsorEnabled: false,
  adSenseClientId: 'ca-pub-XXXXXXXXXXXXXXXX', // 実際のPublisher IDに変更
  adSlots: {
    header: '1234567890',
    sidebar: '1234567891',
    inArticle: '1234567892',
    articleList: '1234567893',
    footer: '1234567894'
  },
  displaySettings: {
    showOnHomePage: true,
    showOnArticlePage: true,
    showOnArticleListPage: true,
    showOnAboutPage: false,
    inArticleFrequency: 3 // 3段落ごとに広告を表示
  },
  styleSettings: {
    backgroundColor: '#f9f9f9',
    borderColor: '#e0e0e0',
    borderRadius: 8,
    margin: 16
  }
};

// 広告設定の管理
export class AdConfigManager {
  private static instance: AdConfigManager;
  private config: AdConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): AdConfigManager {
    if (!AdConfigManager.instance) {
      AdConfigManager.instance = new AdConfigManager();
    }
    return AdConfigManager.instance;
  }

  public getConfig(): AdConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<AdConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  public isAdEnabled(): boolean {
    return this.config.enabled && (
      this.config.adSenseEnabled || 
      this.config.affiliateEnabled || 
      this.config.sponsorEnabled
    );
  }

  public shouldShowAdOnPage(pageType: 'home' | 'article' | 'articleList' | 'about'): boolean {
    if (!this.isAdEnabled()) return false;

    switch (pageType) {
      case 'home':
        return this.config.displaySettings.showOnHomePage;
      case 'article':
        return this.config.displaySettings.showOnArticlePage;
      case 'articleList':
        return this.config.displaySettings.showOnArticleListPage;
      case 'about':
        return this.config.displaySettings.showOnAboutPage;
      default:
        return false;
    }
  }

  private loadConfig(): AdConfig {
    try {
      const saved = localStorage.getItem('adConfig');
      if (saved) {
        return { ...defaultAdConfig, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to load ad config:', error);
    }
    return defaultAdConfig;
  }

  private saveConfig(): void {
    try {
      localStorage.setItem('adConfig', JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save ad config:', error);
    }
  }
}

// 広告表示の条件チェック
export function shouldDisplayAd(
  pageType: 'home' | 'article' | 'articleList' | 'about',
  isAdmin: boolean = false
): boolean {
  // 管理者には広告を表示しない
  if (isAdmin) return false;
  
  const adManager = AdConfigManager.getInstance();
  return adManager.shouldShowAdOnPage(pageType);
}

// 記事内広告の配置判定
export function shouldShowInArticleAd(
  paragraphIndex: number,
  totalParagraphs: number
): boolean {
  const adManager = AdConfigManager.getInstance();
  const config = adManager.getConfig();
  
  if (!config.displaySettings.showOnArticlePage) return false;
  
  // 記事の最初と最後には広告を表示しない
  if (paragraphIndex < 2 || paragraphIndex > totalParagraphs - 2) return false;
  
  // 指定された頻度で広告を表示
  return paragraphIndex % config.displaySettings.inArticleFrequency === 0;
}
