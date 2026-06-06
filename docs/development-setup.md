# 開発環境セットアップガイド

このドキュメントでは、ec2-express-rest-api プロジェクトの開発環境を構築するための手順を説明します。

## 前提条件

以下のツールをインストールしておく必要があります：

- **Node.js**: v16 以上
- **npm**: 8 以上
- **Git**: バージョン管理用

## Node.js のインストール

### macOS

Homebrew を使用する場合：

```bash
# Homebrew のインストール（未インストール時）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js のインストール
brew install node

# バージョン確認
node --version
npm --version
```

### Windows

公式サイトからインストーラーをダウンロード：

1. [Node.js 公式サイト](https://nodejs.org/)にアクセス
2. LTS 版（Long Term Support）をダウンロード
3. インストーラーを実行し、デフォルト設定で進める
4. PowerShell または CMD で確認：

```powershell
node --version
npm --version
```

### Linux（Ubuntu/Debian）

```bash
# パッケージリスト更新
sudo apt update

# Node.js と npm のインストール
sudo apt install -y nodejs npm

# バージョン確認
node --version
npm --version
```

### Linux（RHEL/CentOS）

```bash
# Node.js のインストール
sudo dnf install -y nodejs npm

# バージョン確認
node --version
npm --version
```

## プロジェクトのセットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/YOUR_USERNAME/ec2-express-rest-api.git
cd ec2-express-rest-api
```

### 2. 作業ブランチの作成（初回のみ）

```bash
git checkout -b feature/your-feature-name
```

### 3. 依存パッケージのインストール

```bash
npm install
```

出力例：

```
added 250 packages in 45s
```

### 4. インストール状況の確認

```bash
npm list --depth=0
```

インストールされたパッケージの一覧が表示されます。

## 開発環境の確認

### 1. TypeScript コンパイルのテスト

```bash
npm run build
```

成功時の出力：

```
✓ src/index.ts に対してコンパイルが成功しました
```

### 2. ESLint のチェック

```bash
npm run lint
```

エラーがなければ、何も出力されません。

### 3. 開発サーバーの起動

```bash
npm run dev
```

成功時の出力：

```
Server is running on http://localhost:3000
```

### 4. ヘルスチェック API のテスト

別のターミナルウィンドウで実行：

```bash
curl -s -w '\nHTTP Status: %{http_code}\n' http://localhost:3000/health
```

期待されるレスポンス：

```
{"status":"ok","timestamp":"2026-05-30T12:34:56.789Z"}
HTTP Status: 200
```

## トラブルシューティング

### `npm install` が失敗する

**原因**: Node.js バージョンが古い、またはネットワーク接続の問題

**対策**:

```bash
# Node.js バージョン確認
node --version

# npm キャッシュクリア
npm cache clean --force

# 再度インストール
npm install
```

### `npm run dev` で "command not found" エラー

**原因**: TypeScript コンパイラ（ts-node）がインストールされていない

**対策**:

```bash
# 依存パッケージを改めてインストール
npm install --legacy-peer-deps

# または package-lock.json を削除して再インストール
rm package-lock.json
npm install
```

### ポート 3000 が既に使用中

**原因**: 別のプロセスが同じポートを使用している

**対策**:

```bash
# ポート 3000 を使用しているプロセスを確認（macOS/Linux）
lsof -i :3000

# ポート 3001 で起動（環境変数で指定）
PORT=3001 npm run dev
```

## 推奨される開発設定

### VS Code 拡張機能

開発体験を向上させるため、以下の拡張機能をインストール推奨：

- **ESLint**: `dbaeumer.vscode-eslint`
- **Prettier - Code formatter**: `esbenp.prettier-vscode`
- **Thunder Client** または **REST Client**: API テスト用
- **TypeScript Vue Plugin**: TypeScript サポート

### VS Code 設定（.vscode/settings.json）

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": [
    "javascript",
    "typescript"
  ]
}
```

## よくあるコマンド

| コマンド | 説明 |
|--------|------|
| `npm install` | 依存パッケージをインストール |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | TypeScript をコンパイル |
| `npm start` | 本番ビルドを実行 |
| `npm run lint` | ESLint でコードをチェック |
| `npm run lint:fix` | ESLint で自動修正 |
| `npm run format` | Prettier でコードをフォーマット |

## 次のステップ

セットアップが完了したら、[API ドキュメント](./api.md)を参照して、プロジェクトの開発を始めてください。
