export const TECH_STACK = {
  frontend: [
    { name: 'Next.js', description: 'React フレームワーク' },
    { name: 'TypeScript', description: '型安全な開発環境' },
    { name: 'Tailwind CSS', description: 'モダンなスタイリング' },
    { name: 'shadcn/ui', description: '高品質なUIコンポーネント' },
  ],
  backend: [
    { name: 'Firebase Authentication', description: '認証システム' },
    { name: 'Cloud Firestore', description: 'NoSQLデータベース' },
    { name: 'Cloud Storage', description: 'ファイルストレージ' },
    { name: 'Cloud Functions', description: 'サーバーサイド処理' },
  ],
  tools: [
    { name: 'Git', description: 'バージョン管理' },
    { name: 'ESLint', description: 'コード品質管理' },
    { name: 'Prettier', description: 'コードフォーマット' },
    { name: 'Vercel', description: 'Webホスティング・デプロイ' },
  ],
} as const;

export const BLOG_FEATURES = [
  {
    iconName: 'Code',
    title: 'モダンな技術スタック',
    description: 'Next.js + TypeScript + Firebase による最新のWeb技術を活用',
  },
  {
    iconName: 'Edit3',
    title: 'マークダウンエディタ',
    description: '直感的なマークダウン記法で記事を執筆・編集できます',
  },
  {
    iconName: 'Database',
    title: 'リアルタイムデータベース',
    description: 'Cloud Firestore による高速でスケーラブルなデータ管理',
  },
  {
    iconName: 'Zap',
    title: '高速パフォーマンス',
    description: 'Vercel による高速デプロイと最適化された読み込み速度',
  },
] as const;
