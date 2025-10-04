/** @type {import('next').NextConfig} */
const nextConfig = {
  // Viteプロジェクトなので、Next.jsの設定は不要ですが、
  // 将来的な移行を考慮してプレースホルダーとして作成
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // 必要に応じて実験的機能を有効化
  },
};

module.exports = nextConfig;
