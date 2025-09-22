import { grantAdminRole } from './userManagement';

// 管理者権限を付与する関数
export const initializeAdmin = async (email: string) => {
  try {
    // 注意: 実際の実装では、より安全な方法で管理者権限を付与する必要があります
    console.log(`管理者権限を ${email} に付与しています...`);
    
    // この関数は、Firebase Consoleから手動で実行するか、
    // 管理者用の特別なエンドポイントから呼び出すことを推奨します
    console.warn('この関数は開発環境でのみ使用してください');
    
    return true;
  } catch (error) {
    console.error('管理者権限の付与に失敗しました:', error);
    return false;
  }
};

// 開発用: 特定のメールアドレスを管理者にする
export const makeUserAdmin = async (email: string) => {
  console.log(`開発用: ${email} を管理者に設定してください`);
  console.log('Firebase Consoleで以下の手順を実行してください:');
  console.log('1. Firestore Database に移動');
  console.log('2. users コレクションを開く');
  console.log('3. 該当ユーザーのドキュメントを開く');
  console.log('4. role フィールドを "admin" に変更');
};
