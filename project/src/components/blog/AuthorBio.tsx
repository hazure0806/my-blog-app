import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";

interface AuthorBioProps {
  name: string;
  bio: string;
  avatar: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    email?: string;
  };
  onNavigateToAbout?: () => void;
  showDetailButton?: boolean;
}

export function AuthorBio({ name, bio, avatar, social, onNavigateToAbout, showDetailButton = true }: AuthorBioProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 md:p-8 border border-blue-200 dark:border-gray-600">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <img
          src={avatar}
          alt={name}
          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-white dark:ring-gray-700 shadow-lg"
        />
        
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            {bio}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {social.twitter && (
                <a
                  href={social.twitter}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md"
                >
                  <FaSquareXTwitter className="h-5 w-5" />
                </a>
              )}
              {social.github && (
                <a
                  href={social.github}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md"
                >
                  <FaGithub className="h-5 w-5" />
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md"
                >
                  <FaLinkedin className="h-5 w-5" />
                </a>
              )}
            </div>
            
            {onNavigateToAbout && showDetailButton && (
              <button
                onClick={onNavigateToAbout}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
              >
                詳細を見る →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}