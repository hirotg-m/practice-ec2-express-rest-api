# ec2-express-rest-api

[練習] AWS EC2 REST APIサーバー Node.js Express

## 概要

このプロジェクトは、AWS EC2 上で実行可能な REST API サーバーを Express.js を使用して構築しています。

## 技術スタック

- **Node.js**: v16 以上
- **Express.js**: 4.18
- **TypeScript**: 5.1
- **ESLint**: コード品質管理
- **Prettier**: コードフォーマッター

## セキュリティに関する注意

- 認証情報やシークレット情報は `.env` ファイルで管理し、リポジトリには含めません
- AWS アクセスキーやアクセスポイント情報もリポジトリには含めません
- 今後 CodeQL を使用してセキュリティスキャンを実施予定です

## セットアップ

詳細な開発環境セットアップ手順は [開発環境セットアップガイド](./docs/development-setup.md) を参照してください。

### クイックスタート

#### 前提条件

- Node.js 16 以上
- npm 8 以上

#### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

サーバーは `http://localhost:3000` で起動します。

### ビルド

```bash
npm run build
```

ビルド後のファイルは `dist/` ディレクトリに生成されます。

### 本番サーバーの起動

```bash
npm start
```

## コード品質

### Linting

```bash
npm run lint
```

### Linting & Fix

```bash
npm run lint:fix
```

### Code Formatting

```bash
npm run format
```

## API エンドポイント

### ヘルスチェック

```bash
curl http://localhost:3000/health
```

レスポンス例:
```json
{
  "status": "ok",
  "timestamp": "2026-05-30T12:34:56.789Z"
}
```

## ディレクトリ構造

```
src/
  ├── index.ts           # メインアプリケーション
  ├── routes/            # ルーティング
  ├── controllers/       # ビジネスロジック
  ├── middleware/        # ミドルウェア
  └── types/             # 型定義
tests/                   # テストファイル
```

## ライセンス

MIT License

## 今後の予定

- [ ] 認証機能の実装
- [ ] CodeQL を使用したセキュリティスキャン
- [ ] Docker コンテナ化
- [ ] EC2 デプロイメント手順の整備
