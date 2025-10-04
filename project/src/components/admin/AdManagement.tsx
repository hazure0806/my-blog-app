import React, { useState, useEffect } from 'react';
import { Settings, DollarSign, Eye, BarChart3, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AdConfigManager, defaultAdConfig } from '../../utils/adConfig';
import type { AdConfig } from '../../utils/adConfig';

interface AdManagementProps {
  onBack: () => void;
}

export function AdManagement({ onBack }: AdManagementProps) {
  const [config, setConfig] = useState<AdConfig>(defaultAdConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const adManager = AdConfigManager.getInstance();
    setConfig(adManager.getConfig());
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const adManager = AdConfigManager.getInstance();
      adManager.updateConfig(config);
      setMessage({ type: 'success', text: '広告設定を保存しました' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '設定の保存に失敗しました' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setConfig(defaultAdConfig);
    setMessage({ type: 'success', text: '設定をリセットしました' });
  };

  const updateConfig = (updates: Partial<AdConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateDisplaySettings = (updates: Partial<AdConfig['displaySettings']>) => {
    setConfig(prev => ({
      ...prev,
      displaySettings: { ...prev.displaySettings, ...updates }
    }));
  };

  const updateStyleSettings = (updates: Partial<AdConfig['styleSettings']>) => {
    setConfig(prev => ({
      ...prev,
      styleSettings: { ...prev.styleSettings, ...updates }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={onBack} 
            variant="ghost" 
            className="mb-4 gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          >
            ← ダッシュボードに戻る
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            広告管理
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            広告の表示設定と収益化の管理を行います
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
              : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Basic Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            基本設定
          </h2>
          
          <div className="space-y-6">
            {/* 広告有効化 */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  広告を有効にする
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  サイト全体での広告表示を制御します
                </p>
              </div>
              <button
                onClick={() => updateConfig({ enabled: !config.enabled })}
                className="flex items-center gap-2"
              >
                {config.enabled ? (
                  <ToggleRight className="h-6 w-6 text-blue-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>

            {/* AdSense有効化 */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Google AdSense
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Google AdSense広告の表示
                </p>
              </div>
              <button
                onClick={() => updateConfig({ adSenseEnabled: !config.adSenseEnabled })}
                className="flex items-center gap-2"
                disabled={!config.enabled}
              >
                {config.adSenseEnabled && config.enabled ? (
                  <ToggleRight className="h-6 w-6 text-blue-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>

            {/* AdSense Client ID */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                AdSense Publisher ID
              </label>
              <Input
                value={config.adSenseClientId}
                onChange={(e) => updateConfig({ adSenseClientId: e.target.value })}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                disabled={!config.adSenseEnabled}
              />
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            表示設定
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                ホームページ
              </label>
              <button
                onClick={() => updateDisplaySettings({ showOnHomePage: !config.displaySettings.showOnHomePage })}
                className="flex items-center gap-2"
                disabled={!config.enabled}
              >
                {config.displaySettings.showOnHomePage && config.enabled ? (
                  <ToggleRight className="h-6 w-6 text-blue-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                記事ページ
              </label>
              <button
                onClick={() => updateDisplaySettings({ showOnArticlePage: !config.displaySettings.showOnArticlePage })}
                className="flex items-center gap-2"
                disabled={!config.enabled}
              >
                {config.displaySettings.showOnArticlePage && config.enabled ? (
                  <ToggleRight className="h-6 w-6 text-blue-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                記事一覧ページ
              </label>
              <button
                onClick={() => updateDisplaySettings({ showOnArticleListPage: !config.displaySettings.showOnArticleListPage })}
                className="flex items-center gap-2"
                disabled={!config.enabled}
              >
                {config.displaySettings.showOnArticleListPage && config.enabled ? (
                  <ToggleRight className="h-6 w-6 text-blue-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Aboutページ
              </label>
              <button
                onClick={() => updateDisplaySettings({ showOnAboutPage: !config.displaySettings.showOnAboutPage })}
                className="flex items-center gap-2"
                disabled={!config.enabled}
              >
                {config.displaySettings.showOnAboutPage && config.enabled ? (
                  <ToggleRight className="h-6 w-6 text-blue-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                記事内広告の頻度（段落数）
              </label>
              <Input
                type="number"
                value={config.displaySettings.inArticleFrequency}
                onChange={(e) => updateDisplaySettings({ inArticleFrequency: parseInt(e.target.value) || 3 })}
                min="1"
                max="10"
                disabled={!config.enabled}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                記事内で何段落ごとに広告を表示するかを設定します
              </p>
            </div>
          </div>
        </div>

        {/* Ad Slots */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            広告スロット設定
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                ヘッダー広告
              </label>
              <Input
                value={config.adSlots.header}
                onChange={(e) => updateConfig({ 
                  adSlots: { ...config.adSlots, header: e.target.value }
                })}
                placeholder="1234567890"
                disabled={!config.adSenseEnabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                サイドバー広告
              </label>
              <Input
                value={config.adSlots.sidebar}
                onChange={(e) => updateConfig({ 
                  adSlots: { ...config.adSlots, sidebar: e.target.value }
                })}
                placeholder="1234567891"
                disabled={!config.adSenseEnabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                記事内広告
              </label>
              <Input
                value={config.adSlots.inArticle}
                onChange={(e) => updateConfig({ 
                  adSlots: { ...config.adSlots, inArticle: e.target.value }
                })}
                placeholder="1234567892"
                disabled={!config.adSenseEnabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                記事一覧広告
              </label>
              <Input
                value={config.adSlots.articleList}
                onChange={(e) => updateConfig({ 
                  adSlots: { ...config.adSlots, articleList: e.target.value }
                })}
                placeholder="1234567893"
                disabled={!config.adSenseEnabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                フッター広告
              </label>
              <Input
                value={config.adSlots.footer}
                onChange={(e) => updateConfig({ 
                  adSlots: { ...config.adSlots, footer: e.target.value }
                })}
                placeholder="1234567894"
                disabled={!config.adSenseEnabled}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            {isLoading ? '保存中...' : '設定を保存'}
          </Button>
          
          <Button 
            onClick={handleReset} 
            variant="outline"
            disabled={isLoading}
          >
            リセット
          </Button>
        </div>

        {/* Information */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            広告収益化について
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Google AdSenseの承認が必要です</li>
            <li>• 広告スロットIDはAdSense管理画面で取得してください</li>
            <li>• 記事の品質とアクセス数を向上させることで収益を最大化できます</li>
            <li>• 管理者モードでは広告は表示されません</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
