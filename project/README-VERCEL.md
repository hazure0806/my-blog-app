# Gaku-Log Blog - Vercel Deployment Guide

## 🚀 Vercelデプロイメント手順

### 1. **Vercelアカウント作成**
- [Vercel](https://vercel.com) にアクセス
- GitHubアカウントでサインアップ

### 2. **プロジェクトのインポート**
```bash
# GitHubにプッシュ
git add .
git commit -m "Vercel deployment ready"
git push origin main

# Vercelダッシュボードで「New Project」
# GitHubリポジトリを選択
# プロジェクト名: gaku-log-blog
```

### 3. **環境変数の設定**
Vercelダッシュボードで以下の環境変数を設定：

#### Firebase設定
```
VITE_FIREBASE_API_KEY=your-actual-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-firebase-app-id
```

#### サイト設定
```
VITE_SITE_URL=https://your-vercel-domain.vercel.app
VITE_SITE_NAME=Gaku-Log
VITE_SITE_DESCRIPTION=学びと発見の記録
```

#### AdSense設定（オプション）
```
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_ENABLED=true
```

### 4. **ビルド設定**
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 5. **カスタムドメイン設定（オプション）**
1. Vercelダッシュボード → Settings → Domains
2. 独自ドメインを追加
3. DNS設定を更新

### 6. **自動デプロイ設定**
- デフォルトでGitHubのmainブランチにプッシュすると自動デプロイ
- プレビューデプロイも自動で作成

## 🔧 トラブルシューティング

### ビルドエラーが発生する場合
```bash
# ローカルでビルドテスト
npm run build

# 依存関係の確認
npm install
```

### 環境変数が反映されない場合
- Vercelダッシュボードで環境変数を再確認
- リデプロイを実行

### Firebase接続エラー
- Firebase設定値の確認
- Firebaseプロジェクトの有効化状況確認

## 📊 パフォーマンス最適化

### Vercelの自動最適化機能
- ✅ 自動CDN配信
- ✅ 画像最適化
- ✅ コード分割
- ✅ キャッシュ最適化

### 追加の最適化
- 画像のWebP変換
- フォントの最適化
- バンドルサイズの監視

## 🔒 セキュリティ

### Vercelのセキュリティ機能
- ✅ HTTPS自動有効化
- ✅ セキュリティヘッダー自動設定
- ✅ DDoS保護

### 追加セキュリティ設定
- Firebase Security Rules
- 環境変数の適切な管理

## 📈 監視・分析

### Vercel Analytics（オプション）
- パフォーマンス監視
- ユーザー行動分析
- エラー追跡

### 推奨ツール
- Google Analytics
- Google Search Console
- Firebase Analytics

## 🚀 デプロイ後の作業

1. **Firebase設定の確認**
2. **SEO設定の確認**
3. **Google Search Console登録**
4. **AdSense申請（収益化する場合）**
5. **カスタムドメイン設定**

---

**デプロイ完了後、自動的にHTTPSが有効化され、CDN経由で高速配信されます！**
