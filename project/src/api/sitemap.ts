import { generateDynamicSitemap } from '../utils/sitemap';

export default async function handler(req: any, res: any) {
  try {
    const sitemap = await generateDynamicSitemap();
    
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600'); // 1時間キャッシュ
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
}
