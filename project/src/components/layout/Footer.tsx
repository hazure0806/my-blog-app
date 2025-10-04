import { FaSquareXTwitter, FaGithub, FaLinkedin } from 'react-icons/fa6';
import { FooterAd } from '../ads/AdSense';
import { shouldDisplayAd } from '../../utils/adConfig';

interface FooterProps {
  onNavigateToHome?: () => void;
  onNavigateToArticlesList?: () => void;
  onNavigateToAbout?: () => void;
  isAdmin?: boolean;
}

export function Footer({ onNavigateToHome, onNavigateToArticlesList, onNavigateToAbout, isAdmin = false }: FooterProps) {

  return (
    <>
      {/* フッター広告 */}
      {shouldDisplayAd('home', isAdmin) && (
        <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <FooterAd />
          </div>
        </div>
      )}
      
      <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Blog Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Gaku-Log
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                学びと発見を記録するブログ。
                日々の気づきや成長の軌跡を残していきます。
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors">
                  <FaSquareXTwitter className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors">
                  <FaGithub className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors">
                  <FaLinkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                クイックリンク
              </h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={onNavigateToHome}
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors text-left"
                  >
                    ホーム
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onNavigateToArticlesList}
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors text-left"
                  >
                    記事一覧
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onNavigateToAbout}
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors text-left"
                  >
                    著者について
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-300">
              © 2025 Gaku-Log. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}