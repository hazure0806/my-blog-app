import React, { useState } from 'react';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Blog Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              My Personal Blog
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              日々の生活で発見した小さな喜びや学びを
              気ままに記録している個人ブログです。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              クイックリンク
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">テクノロジー</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">ライフスタイル</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">コーヒー</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">栄養・健康</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              ニュースレター
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              新しい記事の更新情報をお届けします。
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="メールアドレスを入力"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                購読する
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-300">
            © 2025 My Personal Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}