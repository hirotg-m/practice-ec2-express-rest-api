// このファイルは GitHub Actions ESLint の動作テスト用です
// 本番環境では削除してください

// ESLint エラー: 未使用変数
const unusedVariable = 'this is unused';

// ESLint エラー: console.log（許可されていない場合）
console.log('test');

// ESLint エラー: any 型の使用
const anyVariable: any = 'any type';

// ESLint エラー: 型定義がない関数
function testFunction(param) {
  return param;
}

export { testFunction };
