export const TECH_STACK = {
  frontend: [
    { name: 'Vite + React', description: '高速なSPAフレームワーク' },
    { name: 'TypeScript', description: '型安全な開発環境' },
    { name: 'Tailwind CSS', description: 'ユーティリティファーストCSS' },
    { name: 'Lucide React', description: 'モダンなアイコンライブラリ' },
  ],
  backend: [
    { name: 'Firebase Authentication', description: '認証システム' },
    { name: 'Cloud Firestore', description: 'NoSQLデータベース' },
    { name: 'Cloud Storage', description: 'ファイルストレージ' },
    { name: 'Supabase', description: 'オルタナティブBaaS' },
  ],
  tools: [
    { name: 'ESLint + TypeScript ESLint', description: 'コード品質管理' },
    { name: 'PostCSS + Autoprefixer', description: 'CSS後処理ツール' },
    { name: 'Vercel', description: 'Webホスティング・デプロイ' },
    { name: 'Git', description: 'バージョン管理' },
  ],
} as const;

export const BLOG_FEATURES = [
  {
    iconName: 'Code',
    title: 'モダンな技術スタック',
    description: 'Vite + React + TypeScript + Firebase による最新のWeb技術を活用',
  },
  {
    iconName: 'Edit3',
    title: 'マークダウンエディタ',
    description: '直感的なマークダウン記法で記事を執筆・編集できます',
  },
  {
    iconName: 'Database',
    title: 'リアルタイムデータベース',
    description: 'Firebase + Supabase による高速でスケーラブルなデータ管理',
  },
  {
    iconName: 'Zap',
    title: '高速パフォーマンス',
    description: 'Viteの高速ビルドとVercelによる最適化された読み込み速度',
  },
] as const;
